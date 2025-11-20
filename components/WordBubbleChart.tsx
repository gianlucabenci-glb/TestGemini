import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WordNode } from '../types';

interface Props {
  data: WordNode[];
}

interface D3Node extends d3.HierarchyCircularNode<WordNode> {
  x: number;
  y: number;
  r: number;
}

const WordBubbleChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 20;

    // Clear previous svg
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 12px sans-serif; text-anchor: middle;");

    // Color scale
    const color = (type: string) => {
      switch(type) {
        case 'complaint': return '#ef4444'; // red-500
        case 'praise': return '#22c55e'; // green-500
        default: return '#94a3b8'; // slate-400
      }
    };

    // Pack layout
    const pack = d3.pack<WordNode>()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .padding(3);

    const root = d3.hierarchy<any>({ children: data })
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const rootNode = pack(root);
    
    // Use a group to center content
    const g = svg.append("g")
       .attr("transform", `translate(${marginLeft},${marginTop})`);

    const leaf = g.selectAll("g")
      .data(rootNode.leaves())
      .join("g")
      .attr("transform", (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    // Circles
    leaf.append("circle")
      .attr("r", (d: any) => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", (d: any) => color(d.data.type));

    // Text (Title)
    leaf.append("text")
      .attr("y", "0.3em") // Vertically center
      .text((d: any) => d.data.text)
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", (d: any) => Math.min(d.r / 2, 16)) // Responsive font size
      .attr("pointer-events", "none")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)"); // Readability

    // Tooltip title
    leaf.append("title")
      .text((d: any) => `${d.data.type.toUpperCase()}: ${d.data.text}\nFrequency: ${d.data.value}`);

  }, [data]);

  return (
    <div ref={wrapperRef} className="w-full h-[400px] bg-slate-50 rounded-lg border border-slate-200 overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full display-block"></svg>
      {data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          No keyword data available
        </div>
      )}
    </div>
  );
};

export default WordBubbleChart;