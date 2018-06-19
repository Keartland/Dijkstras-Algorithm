const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function dist(from,to){
  return Math.sqrt(Math.pow(Math.abs(from.x - to.x),2) + Math.pow(Math.abs(from.y - to.y),2))
}
verts = 5

graph = new Array(verts);
for (i=0;i < verts;i++){graph[i] = new Array(verts);}

pos = []
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
for (i=0;i < verts;i++){
  pos.push({name: alphabet[i],x:Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)})
}

for (i=0;i < verts;i++){
  for (j=0;j < verts;j++){
    if (Math.random() < 0.25 && i != j){
		graph[i][j] = dist(pos[i],pos[j])
		graph[j][i] = dist(pos[i],pos[j])
		context.beginPath();
		context.moveTo(pos[i].x,pos[i].y);
		context.lineTo(pos[j].x,pos[j].y);
		context.stroke();
    } else{
		graph[i][j] = Infinity
	}
  }
}


for (h=0;h < graph.length;h++){
	console.log(graph[h])
}

function djikstra(s, e, graph, pos){
	start = alphabet.indexOf(s)
	end = alphabet.indexOf(e)
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
	//for (p=0;p < 100;p++){
		fOpenScore = []
		for(i=0;i < fScore.length;i++){
			if (i in openSet){
				fOpenScore.push(fScore[openSet[i]])
			} else {
				fOpenScore.push(Infinity)
			}
		}
		minnie = Math.min(...fOpenScore)
		current = fOpenScore.indexOf(minnie);
		console.log(openSet)
		console.log(openSet.length)
		console.log(current)
		if (current == end){
            return reconstruct_path(cameFrom, current)
		}
		openSet.splice(current,1)
        closedSet.push(current)
		for(i=0; i < graph[current].length;i++){
			if (graph[current][i] == Infinity){
				continue
			}
			if (i in closedSet){
				continue
			}
			if (!(i in openSet)){
				openSet.push(i)
			}
			tentative_gScore = gScore[current] + dist(pos[current], pos[i])
			if (tentative_gScore >= gScore[i]){
				continue
			}
			cameFrom[i] = current
			gScore[i] = tentative_gScore
			fScore[i] = gScore[i] + dist(pos[i], pos[end])
				
		}
		
	}
	
	return "No Path"
}

function reconstruct_path(cameFrom, current){
	console.log(cameFrom)
    total_path = [alphabet[current]]
    while (current in cameFrom){
        current = cameFrom[current]
        total_path.push(alphabet[current])
	}
    return total_path.reverse()
}
console.log(djikstra("a","c",graph, pos))
for(i=0;i < pos.length;i++){
	context.fillStyle = "black";
	context.beginPath();
	context.arc(pos[i].x, pos[i].y, 10, 0, 2 * Math.PI, false);
	context.fill()
	context.fillStyle = "white";
	context.fillText(pos[i].name,pos[i].x,pos[i].y)
	
}