const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function dist(from,to){
  return Math.sqrt(Math.pow(Math.abs(from.x - to.x),2) + Math.pow(Math.abs(from.y - to.y),2))
}

function createRGraph(verts){
	graph = new Array(verts);
	for (i=0;i < verts;i++){graph[i] = new Array(verts);}

	pos	= []
	for (i=0;i < verts;i++){
		pos.push({name: i,x:Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)})
	}

	for (i=0;i < verts;i++){
		for (j=0;j < verts;j++){
			if ((Math.random() < 0.1) && (i != j) && !((i == 0) && (j == verts - 1) || (j == 0) && (i == verts - 1))){
				len = dist(pos[i],pos[j])
				graph[i][j] = len
				graph[j][i] = len
				context.strokeStyle = "black"
				context.lineWidth = 1;
				context.beginPath();
				context.moveTo(pos[i].x,pos[i].y);
				context.lineTo(pos[j].x,pos[j].y);
				context.stroke();
			} else{
				graph[i][j] = Infinity
			}
		}
	}
return {graph:graph, pos:pos}
}

function createFGraph(verts,end){
	graph = new Array(verts);
	for (i=0;i < verts;i++){graph[i] = new Array(verts);}

	pos	= []
	for (i=0;i < verts;i++){
		pos.push({name: i,x:i*(canvas.width/verts), y:canvas.height/2 + (canvas.height/2)*Math.sin(i)})	
	}

	for (i=0;i < verts;i++){
		for (j=0;j < verts;j++){
			if ((Math.random() < 0.5) && (i != j) && (!(i == 0) && !(i == end) || !(j == 0) && !(j == end)) && Math.abs(i - j) < 6){
				len = dist(pos[i],pos[j])
				graph[i][j] = len
				graph[j][i] = len
				context.strokeStyle = "black"
				context.lineWidth = 1;
				context.beginPath();
				context.moveTo(pos[i].x,pos[i].y);
				context.lineTo(pos[j].x,pos[j].y);
				context.stroke();
			} else {
				graph[i][j] = Infinity
			}
		}
	}
return {graph:graph, pos:pos}
}



function drawNode(pos){
	context.beginPath();
	context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI, false);
	context.fill()
	
}
function drawNode(pos,r){
	context.beginPath();
	context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
	context.fill()
}

async function djikstra(s, e, graph, pos){
	start = s
	end = e
	closedSet = []
	openSet = [start]
	cameFrom = []
	gScore = []
	for (i=0;i < graph.length;i++){gScore.push(Infinity)}
	gScore[start] = 0
	fScore = []
	for (i=0;i < graph.length;i++){fScore.push(Infinity)}
	fScore[start] = dist(pos[start], pos[end])

	while(openSet.length > 0){
		min = Infinity 
		current = -1
		for(i=0;i < openSet.length;i++){
			if (fScore[openSet[i]] < min){
				min = fScore[openSet[i]]
				current = openSet[i]
			}
		}
		context.fillStyle = "blue"
		drawNode(pos[current])
		// console.log("current: " + current + " end: " + end)
		if (current == end){
            return await reconstruct_path(cameFrom, current)
		}
		// console.log(openSet)
		openSet.splice(openSet.indexOf(current),1)

        closedSet.push(current)

		for(i=0; i < graph[current].length;i++){
			if (graph[current][i] == Infinity){
				continue
			}
			//console.log("neigh: "+i)
			if (closedSet.indexOf(i) != -1){
				continue
			}
			if (openSet.indexOf(i) == -1){
				openSet.push(i)
			}
			tentative_gScore = gScore[current] + dist(pos[current], pos[i])
			if (tentative_gScore >= gScore[i]){
				continue
			}
			cameFrom[i] = current
			gScore[i] = tentative_gScore
			fScore[i] = gScore[i] + dist(pos[i], pos[end])
			
			context.fillStyle = "red"
			drawNode(pos[i])
			context.lineWidth=2;
			context.strokeStyle = "lime"
			context.beginPath();
			context.moveTo(pos[current].x,pos[current].y);
			context.lineTo(pos[i].x,pos[i].y);
			context.stroke();
			await new Promise(resolve => setTimeout(resolve, 100))
			context.fillStyle = "black"
			drawNode(pos[i])

			
				
		}
		context.fillStyle = "black"
		drawNode(pos[current])
		
		
	}
	
	return "No Path"
}

async function reconstruct_path(cameFrom, current){
    total_path = [current]
    while (current in cameFrom){
		last = current
		context.lineWidth=10;
        current = cameFrom[current]
        total_path.push(current)
		context.strokeStyle = "yellow"
		context.beginPath();
		context.moveTo(pos[current].x,pos[current].y);
		context.lineTo(pos[last].x,pos[last].y);
		context.stroke();
	}
	await new Promise(resolve => setTimeout(resolve, 2))
    return total_path.reverse()
}


async function loop(){
	while (true){
		console.clear()
		context.fillStyle = "white"
		context.rect(0, 0, canvas.width, canvas.height)
		context.fill()
		verts = Math.floor(Math.random() * (50 - 10 + 1)) + 10
		end = Math.floor(Math.random() * (verts - 1))
		yo = createFGraph(verts,end)
		for(i=0;i < yo.pos.length;i++){
			context.fillStyle = "black"
			drawNode(pos[i],5)
		}
		context.fillStyle = "blue"
		drawNode(pos[end],10)
		await djikstra(0,end,yo.graph, yo.pos).then(data => console.log(data))
		await new Promise(resolve => setTimeout(resolve, 2000))
		
	}
}
loop()


