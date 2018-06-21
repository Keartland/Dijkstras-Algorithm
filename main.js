const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function dist(from,to){
  return Math.sqrt(Math.pow(Math.abs(from.x - to.x),2) + Math.pow(Math.abs(from.y - to.y),2))
}

function createFGraph(verts){
graph = new Array(verts);
for (i=0;i < verts;i++){graph[i] = new Array(verts);}

vertexPositions	= []
for (i=0;i < verts;i++){
    y = (canvas.height / 2) + (8*Math.sin(2*(i- verts/2)) * (Math.pow(0.8, i - verts/2) + Math.pow(1.2, i - verts/2)) + (Math.random() * 200) - 100)
    vertexPositions.push({
    name: i,
    x: i * (canvas.width / verts) + (Math.random() * canvas.width / (2*verts)),
    y: y > canvas.height ? canvas.height : y < 0 ? 0 : y,
    })
  }
  for (i=0;i < verts;i++){
    connections = 0
    for (j=0;j < verts;j++){
      if (Math.random() < 0.5 && connections <= 4 && (i != j) && Math.abs(i - j) < 5){
        len = dist(vertexPositions[i],vertexPositions[j])
        graph[i][j] = len
        graph[j][i] = len
        connections++
      } else {
        graph[i][j] = Infinity
      }
    }
  }
  return {graph:graph, vertexPositions:vertexPositions}
}

function drawWeights(graph){
  for (i=0;i < graph.graph.length ;i++){
    for (j=0;j < graph.graph[i].length ;j++){
      if (graph.graph[i][j] != Infinity){
        drawLine(graph.vertexPositions[i], graph.vertexPositions[j], 1, "black")
      }
    }
  }
}

function drawNode(vertexPosition, radius, colour){
  context.fillStyle = colour
  context.beginPath();
  context.arc(vertexPosition.x, vertexPosition.y, radius, 0, 2 * Math.PI, false);
  context.fill()
}
function drawLine(startPosition, endPosition, width, colour){
  context.strokeStyle = colour
  context.lineWidth = width
  context.beginPath();
  context.moveTo(startPosition.x,startPosition.y);
  context.lineTo(endPosition.x,endPosition.y);
  context.stroke();
}

async function djikstra(s, e, graph){
  start = s
  end = e
  closedSet = []
  openSet = [start]
  cameFrom = []
  gScore = []
  for (i=0;i < graph.graph.length;i++){gScore.push(Infinity)}
  gScore[start] = 0
  fScore = []
  for (i=0;i < graph.graph.length;i++){fScore.push(Infinity)}
  fScore[start] = dist(graph.vertexPositions[start], graph.vertexPositions[end])

  while(openSet.length > 0){
    min = Infinity
    current = -1
    for(i=0;i < openSet.length;i++){
      if (fScore[openSet[i]] < min){
        min = fScore[openSet[i]]
        current = openSet[i]
      }
    }
    if (current == end){
      return reconstruct_path(cameFrom, current, graph)
    }
    openSet.splice(openSet.indexOf(current),1)
    closedSet.push(current)
    for(i=0; i < graph.graph[current].length;i++){
      if (graph.graph[current][i] == Infinity){
        continue
      }
      if (closedSet.indexOf(i) != -1){
        continue
      }
      if (openSet.indexOf(i) == -1){
        openSet.push(i)
      }
      tentative_gScore = gScore[current] + dist(graph.vertexPositions[current], graph.vertexPositions[i])
      if (tentative_gScore >= gScore[i]){
        continue
      }
      cameFrom[i] = current
      gScore[i] = tentative_gScore
      fScore[i] = gScore[i] + dist(graph.vertexPositions[i], graph.vertexPositions[end])
      await new Promise(resolve => setTimeout(resolve, 100))
      drawLine(graph.vertexPositions[current], graph.vertexPositions[i], 3, "lime")
      drawNode(graph.vertexPositions[current], 8,  "red")
    }
  }
  return "No Path"
}

async function reconstruct_path(cameFrom, current, graph){
  for (i = 0; i < graph.vertexPositions.length; i++){
    if (cameFrom[i] != undefined){
      drawNode(graph.vertexPositions[i], 8, "black")
    }
  }
  drawNode(graph.vertexPositions[current], 10, "purple")
  total_path = [current]
  while (current in cameFrom){
    last = current
    current = cameFrom[current]
    total_path.push(current)
    drawLine(graph.vertexPositions[current], graph.vertexPositions[last], 6, "yellow")
    for (w = 0; w < cameFrom.length; w++){
      if (cameFrom[w] != undefined){
        drawNode(graph.vertexPositions[cameFrom[last]], 8,  "red")
      }
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  return total_path.reverse()
}


async function loop(){
  while (true){
    console.clear()
    context.fillStyle = "white"
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
    numberOfVerts = Math.floor(Math.random() * (20 + 1)) + 20
    goal = numberOfVerts - Math.floor(Math.random() * 5) - 1
    graph = createFGraph(numberOfVerts)
    drawWeights(graph)
    for(i=0;i < graph.vertexPositions.length;i++){
      drawNode(graph.vertexPositions[i], 8, "black")
    }
    drawNode(graph.vertexPositions[goal],10, "purple")
    await djikstra(0, goal, graph).then(data => console.log(data))
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
}
loop()
