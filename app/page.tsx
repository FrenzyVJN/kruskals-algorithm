'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type Edge = {
  from: number
  to: number
  weight: number
}

type Node = {
  id: number
  x: number
  y: number
}

const initialNodes: Node[] = [
  { id: 0, x: 50, y: 50 },
  { id: 1, x: 200, y: 50 },
  { id: 2, x: 125, y: 150 },
  { id: 3, x: 50, y: 250 },
  { id: 4, x: 200, y: 250 },
]

const initialEdges: Edge[] = [
  { from: 0, to: 1, weight: 2 },
  { from: 1, to: 2, weight: 1 },
  { from: 1, to: 4, weight: 4 },
  { from: 2, to: 3, weight: 5 },
  { from: 2, to: 4, weight: 6 },
  { from: 3, to: 4, weight: 7 },
]

function find(parent: number[], i: number): number {
  if (parent[i] === i) return i
  return find(parent, parent[i])
}

function union(parent: number[], rank: number[], x: number, y: number) {
  const xroot = find(parent, x)
  const yroot = find(parent, y)

  if (rank[xroot] < rank[yroot]) {
    parent[xroot] = yroot
  } else if (rank[xroot] > rank[yroot]) {
    parent[yroot] = xroot
  } else {
    parent[yroot] = xroot
    rank[xroot]++
  }
}

const quizQuestions = [
  {
    question: "What is the main goal of Kruskal's Algorithm?",
    options: [
      "Find the shortest path between two nodes",
      "Find the Minimum Spanning Tree",
      "Find all cycles in a graph",
      "Sort the edges of a graph"
    ],
    correctAnswer: 1
  },
  {
    question: "In Kruskal's Algorithm, how are the edges initially processed?",
    options: [
      "In random order",
      "In the order they appear in the graph",
      "Sorted by weight in ascending order",
      "Sorted by weight in descending order"
    ],
    correctAnswer: 2
  },
  {
    question: "What data structure is commonly used to detect cycles in Kruskal's Algorithm?",
    options: [
      "Stack",
      "Queue",
      "Heap",
      "Disjoint Set (Union-Find)"
    ],
    correctAnswer: 3
  }
]

export default function EnhancedKruskalSimulator() {
  const [nodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [mst, setMst] = useState<Edge[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [explanation, setExplanation] = useState<string>('')
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>(new Array(quizQuestions.length).fill(-1))
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)

  const runKruskalStep = () => {
    if (currentStep === 0) {
      setExplanation("First, we sort all edges by weight in ascending order.")
      setEdges([...edges.sort((a, b) => a.weight - b.weight)])
      setCurrentStep(1)
      return
    }

    if (currentStep > edges.length) {
      setExplanation("The algorithm is complete. We have found the Minimum Spanning Tree!")
      setIsAutoPlaying(false)
      return
    }

    const parent = Array.from({ length: nodes.length }, (_, i) => i)
    const rank = Array(nodes.length).fill(0)

    const newMst = mst.slice(0, currentStep - 1)
    const edge = edges[currentStep - 1]

    const x = find(parent, edge.from)
    const y = find(parent, edge.to)

    if (x !== y) {
      newMst.push(edge)
      union(parent, rank, x, y)
      setExplanation(`Adding edge (${edge.from} - ${edge.to}) with weight ${edge.weight} to the MST.`)
    } else {
      setExplanation(`Skipping edge (${edge.from} - ${edge.to}) to avoid creating a cycle.`)
    }

    setMst(newMst)
    setCurrentStep(currentStep + 1)
  }

  const reset = () => {
    setEdges(initialEdges)
    setMst([])
    setCurrentStep(0)
    setExplanation('')
    setIsAutoPlaying(false)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAutoPlaying) {
      timer = setTimeout(runKruskalStep, 1500)
    }
    return () => clearTimeout(timer)
  }, [isAutoPlaying, currentStep])

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
  }

  const handleQuizReset = () => {
    setQuizAnswers(new Array(quizQuestions.length).fill(-1))
    setQuizSubmitted(false)
  }

  return (
    <main className='min-h-screen md:py-10 py-10'>
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Enhanced Kruskal's Algorithm Simulator</CardTitle>
        <CardDescription>
          Visualize, interact, and test your understanding of Kruskal's algorithm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simulator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simulator">Simulator</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          <TabsContent value="simulator">
            <div className="flex flex-col items-center space-y-4">
            <svg width="50%" height="50%" viewBox="0 0 250 300" className="border border-gray-300 rounded">
            {edges.map((edge, index) => {
                  const start = nodes[edge.from]
                  const end = nodes[edge.to]
                  const isMst = mst.some(e => e.from === edge.from && e.to === edge.to)
                  return (
                    <motion.g key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <line
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={isMst ? "red" : "gray"}
                        strokeWidth={isMst ? 3 : 1}
                      />
                      <text
                        x={(start.x + end.x) / 2}
                        y={(start.y + end.y) / 2}
                        textAnchor="middle"
                        fill={isMst ? "white" : "white"}
                        fontSize="12"
                      >
                        {edge.weight}
                      </text>
                    </motion.g>
                  )
                })}
                {nodes.map((node) => (
                  <motion.circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    fill="blue"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                ))}
                {nodes.map((node) => (
                  <text
                    key={node.id}
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy=".3em"
                    fill="white"
                  >
                    {node.id}
                  </text>
                ))}
              </svg>
              <div className="text-center">
                <p className="mb-2">{explanation}</p>
                <div className="space-x-2">
                  <Button onClick={runKruskalStep} disabled={isAutoPlaying || currentStep > edges.length}>
                    {currentStep === 0 ? 'Start' : 'Next Step'}
                  </Button>
                  <Button onClick={toggleAutoPlay} variant="outline">
                    {isAutoPlaying ? 'Pause' : 'Auto Play'}
                  </Button>
                  <Button onClick={reset} variant="outline">Reset</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="quiz">
            <div className="space-y-4">
              {quizQuestions.map((q, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{q.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={quizAnswers[index].toString()}
                      onValueChange={(value) => {
                        const newAnswers = [...quizAnswers]
                        newAnswers[index] = parseInt(value)
                        setQuizAnswers(newAnswers)
                      }}
                      disabled={quizSubmitted}
                    >
                      {q.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIndex.toString()} id={`q${index}-option${optionIndex}`} />
                          <Label htmlFor={`q${index}-option${optionIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {quizSubmitted && (
                      <p className={`mt-2 ${quizAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                        {quizAnswers[index] === q.correctAnswer ? 'Correct!' : `Incorrect. The correct answer is: ${q.options[q.correctAnswer]}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-center space-x-2">
                <Button onClick={handleQuizSubmit} disabled={quizSubmitted || quizAnswers.includes(-1)}>
                  Submit Quiz
                </Button>
                <Button onClick={handleQuizReset} variant="outline">
                  Reset Quiz
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    <footer className="w-full text-center py-4  text-white">
        <p>Made for fun by <a href="https://github.com/FrenzyVJN" target="_blank" >FrenzyVJN</a></p>
    </footer>
    </main>
  )
}