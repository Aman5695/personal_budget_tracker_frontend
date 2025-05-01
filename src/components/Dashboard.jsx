// src/components/Dashboard.js
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as d3 from 'd3'
import TransactionForm from './TransactionForm'
import TransactionOverview from './TransactionOverview'
import BudgetManagement from './BudgetManagement'
import '../styles/Dashboard.css'
import { useDispatch } from 'react-redux'
import { logout } from '../actions/authActions'

export default function Dashboard() {
  const [editTx, setEditTx] = useState(null)
  const dispatch = useDispatch()
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: '',
    amountMin: '',
    amountMax: '',
  })
  const allTx = useSelector((state) => state.transactions.list)
  const filtered = allTx.filter((tx) => {
    if (filters.dateFrom && tx.date < filters.dateFrom) return false
    if (filters.dateTo && tx.date > filters.dateTo) return false
    if (filters.category && !tx.category.toLowerCase().includes(filters.category.toLowerCase()))
      return false
    if (filters.amountMin && tx.amount < +filters.amountMin) return false
    if (filters.amountMax && tx.amount > +filters.amountMax) return false
    return true
  })

  const pieRef = useRef()

  useEffect(() => {
    const svg = d3.select(pieRef.current)
    svg.selectAll('*').remove()
    d3.select('body').selectAll('.tooltip').remove()

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    const dataMap = filtered.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + tx.amount
      return acc
    }, {})
    const pieData = Object.entries(dataMap).map(([key, value]) => ({ key, value }))
    const width = 250,
      height = 150
    const radius = Math.min(width, height) / 3
    const color = d3.scaleOrdinal().domain(pieData.map((d) => d.key)).range(d3.schemeCategory10)

    const defs = svg.append('defs')
    pieData.forEach((d) => {
      const grad = defs.append('radialGradient').attr('id', `grad-${d.key}`)
      grad.append('stop').attr('offset', '0%').attr('stop-color', color(d.key)).attr('stop-opacity', 1)
      grad
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(color(d.key)).darker(0.7))
        .attr('stop-opacity', 1)
    })

    const pieGen = d3.pie().value((d) => d.value)(pieData)
    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius)
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(100,70)`)

    const paths = g
      .selectAll('path')
      .data(pieGen)
      .enter()
      .append('path')
      .attr('fill', (d) => `url(#grad-${d.data.key})`)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition().duration(200).attr('transform', 'scale(1.05)')
        tooltip
          .html(`${d.data.key}: ${d.data.value}`)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px')
        tooltip.transition().duration(200).style('opacity', 1)
      })
      .on('mousemove', (event) => {
        tooltip.style('left', event.pageX + 10 + 'px').style('top', event.pageY + 10 + 'px')
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).transition().duration(200).attr('transform', 'scale(1)')
        tooltip.transition().duration(200).style('opacity', 0)
      })

    paths
      .transition()
      .duration(750)
      .attrTween('d', (d) => {
        const i = d3.interpolate({ startAngle: d.startAngle, endAngle: d.startAngle }, d)
        return (t) => arc(i(t))
      })

    const legendG = svg.append('g').attr('transform', 'translate(150,10)')
    const legend = legendG
      .selectAll('.legend')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (_d, i) => `translate(0, ${i * 20})`)

    legend
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => color(d.key))
      .on('mouseover', (_e, d) => {
        paths
          .filter((p) => p.data.key === d.key)
          .transition()
          .duration(200)
          .attr('d', d3.arc().innerRadius(radius * 0.55).outerRadius(radius * 1.05))
      })
      .on('mouseout', () => {
        paths.transition().duration(200).attr('d', arc)
      })

    legend
      .append('text')
      .attr('x', 24)
      .attr('y', 14)
      .text((d) => d.key)
  }, [filtered])

const handleLogout = async e => {
    e.preventDefault()
    await dispatch(logout())
  }

  return (
    <div className="dashboard">
        <button onClick={handleLogout} style={{float:'right', padding:"5px 20px", color:"red"}}>LogOut</button>
      <h1>Dashboard</h1>
      
      <div className="dashboard-content">
      
      
<div>
<TransactionForm editTx={editTx} onDone={() => setEditTx(null)} />
      <TransactionOverview
        data={allTx}
        filters={filtered}
        onFilterChange={(field, value) => setFilters((f) => ({ ...f, [field]: value }))}
        onEdit={setEditTx}
      />
</div>
<div className='dashboard-graph'>
      <svg ref={pieRef}></svg>
      <BudgetManagement transactions={filtered} />
      </div>
</div>
      
    </div>
  )
}
