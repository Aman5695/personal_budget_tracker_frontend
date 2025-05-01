// // src/components/BudgetManagement.js
// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import * as d3 from 'd3';
// import { setBudget } from '../actions/budgetActions';
// import '../styles/BudgetManagement.css';

// export default function BudgetManagement({ transactions }) {
//   const [input, setInput] = useState('');
//   const budget = useSelector((s) => s.budget.monthly);
//   const allTx = useSelector((s) => s.transactions.list);
//   const txList = transactions || allTx;
//   const dispatch = useDispatch();
//   const ref = useRef();
//   const spent = txList.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

//   useEffect(() => {
//     const svg = d3.select(ref.current);
//     svg.selectAll('*').remove();
//     d3.select('body').selectAll('.tooltip').remove();
//     const tooltip = d3.select('body')
//       .append('div')
//       .attr('class', 'tooltip')
//       .style('opacity', 0);

//     const data = [
//       { name: 'Spent', value: spent },
//       { name: 'Remaining', value: Math.max(budget - spent, 0) },
//     ];
//     const width = 250, height = 150;
//     const radius = Math.min(width, height) / 3;
//     const color = d3.scaleOrdinal().domain(data.map((d) => d.name)).range(d3.schemeSet2);

//     const defs = svg.append('defs');
//     data.forEach(d => {
//       const grad = defs.append('radialGradient').attr('id', `grad-${d.name}`);
//       grad.append('stop').attr('offset', '0%').attr('stop-color', color(d.name)).attr('stop-opacity', 1);
//       grad.append('stop').attr('offset', '100%').attr('stop-color', d3.color(color(d.name)).darker(0.7)).attr('stop-opacity', 1);
//     });

//     const pieGen = d3.pie().value((d) => d.value)(data);
//     const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
//     const g = svg.attr('width', width).attr('height', height)
//       .append('g').attr('transform', `translate(${width/2},${height/2})`);

//     const paths = g.selectAll('path').data(pieGen).enter().append('path')
//       .attr('fill', (d) => `url(#grad-${d.data.name})`)
//       .on('mouseover', (event, d) => {
//         d3.select(event.currentTarget).transition().duration(200).attr('transform', 'scale(1.05)');
//         tooltip.html(`${d.data.name}: ${d.data.value}`);
//         tooltip.transition().duration(200).style('opacity', 1);
//       })
//       .on('mousemove', (event) => {
//         tooltip.style('left', (event.pageX + 10) + 'px').style('top', (event.pageY + 10) + 'px');
//       })
//       .on('mouseout', (event) => {
//         d3.select(event.currentTarget).transition().duration(200).attr('transform', 'scale(1)');
//         tooltip.transition().duration(200).style('opacity', 0);
//       });

//     paths.transition().duration(750).attrTween('d', (d) => {
//       const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
//       return (t) => arc(i(t));
//     });

//     const legendG = svg.append('g').attr('transform', 'translate(175,10)');
//     const legend = legendG.selectAll('.legend').data(data).enter().append('g')
//       .attr('class', 'legend')
//       .attr('transform', (_d, i) => `translate(0, ${i * 20})`);

//     legend.append('rect')
//       .attr('width', 18)
//       .attr('height', 18)
//       .attr('fill', (d) => color(d.name))
//       .on('mouseover', (_event, d) => {
//         paths.filter((p) => p.data.name === d.name)
//           .transition().duration(200)
//           .attr('d', d3.arc().innerRadius(radius * 0.55).outerRadius(radius * 1.05));
//       })
//       .on('mouseout', () => {
//         paths.transition().duration(200).attr('d', arc);
//       });

//     legend.append('text')
//       .attr('x', 24)
//       .attr('y', 14)
//       .text((d) => d.name);
//   }, [budget, spent]);

//   const handleSet = () => {
//     dispatch(setBudget(+input));
//     setInput('');
//   };

//   return (
//     <div className="budget-mgmt">
//       <h2>Budget</h2>
//       <input
//         type="number"
//         placeholder="Set Monthly Budget"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button onClick={handleSet}>Set</button>
//       <svg ref={ref}></svg>
//       <p>Budget: {budget} | Spent: {spent} | Remaining: {budget - spent}</p>
//     </div>
//   );
// }

// src/components/BudgetManagement.js
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as d3 from 'd3';
import { setBudget } from '../actions/budgetActions';
import '../styles/BudgetManagement.css';

export default function BudgetManagement({ transactions }) {
  const [input, setInput] = useState('');
  const budget = useSelector((s) => s.budget.monthly);
  const allTx = useSelector((s) => s.transactions.list);
  const txList = transactions || allTx;
  const dispatch = useDispatch();
  const ref = useRef();
  const spent = txList
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    d3.select('body').selectAll('.tooltip').remove();

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const data = [
      { name: 'Spent', value: spent },
      { name: 'Remaining', value: Math.max(budget - spent, 0) },
    ];

    const width = 250, height = 150;
    const radius = Math.min(width, height) / 3;
    const color = d3.scaleOrdinal().domain(data.map((d) => d.name)).range(d3.schemeSet2);

    const defs = svg.append('defs');
    data.forEach(d => {
      const grad = defs.append('radialGradient').attr('id', `grad-${d.name}`);
      grad.append('stop').attr('offset', '0%').attr('stop-color', color(d.name)).attr('stop-opacity', 1);
      grad.append('stop').attr('offset', '100%').attr('stop-color', d3.color(color(d.name)).darker(0.7)).attr('stop-opacity', 1);
    });

    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
    const arcHover = d3.arc().innerRadius(radius * 0.55).outerRadius(radius * 1.05);
    const pieGen = d3.pie().value((d) => d.value)(data);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(90,70)`);

    const paths = g.selectAll('path')
      .data(pieGen)
      .enter()
      .append('path')
      .attr('fill', (d) => `url(#grad-${d.data.name})`)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', arcHover);
        tooltip.html(`${d.data.name}: ${d.data.value}`);
        tooltip.transition().duration(200).style('opacity', 1);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('d', arc);
        tooltip.transition().duration(200).style('opacity', 0);
      })
      .transition()
      .duration(750)
      .attrTween('d', (d) => {
        const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d);
        return (t) => arc(i(t));
      });

    const legendG = svg.append('g').attr('transform', 'translate(140,10)');
    const legend = legendG.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (_d, i) => `translate(0, ${i * 20})`);

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => color(d.name))
      .on('mouseover', (_event, d) => {
        paths
          .filter((p) => p.data.name === d.name)
          .transition()
          .duration(200)
          .attr('d', arcHover);
      })
      .on('mouseout', (_event, d) => {
        paths
          .filter((p) => p.data.name === d.name)
          .transition()
          .duration(200)
          .attr('d', arc);
      });

    legend.append('text')
      .attr('x', 24)
      .attr('y', 14)
      .text((d) => d.name);
  }, [budget, spent]);

  const handleSet = () => {
    dispatch(setBudget(+input));
    setInput('');
  };

  return (
    <div className="budget-mgmt">
      <h2>Budget</h2>
      <input
        type="number"
        placeholder="Set Monthly Budget"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSet}>Set</button>
      <svg ref={ref}></svg>
      <p>Budget: {budget} | Spent: {spent} | Remaining: {budget - spent}</p>
    </div>
  );
}

