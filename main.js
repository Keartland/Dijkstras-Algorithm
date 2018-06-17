const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function dist(from,to){
  return Math.sqrt(Math.pow(Math.abs(from.x - to.x),2) + Math.pow(Math.abs(from.y - to.y),2))
}
verts = 3

graph = new Array(verts);
for (i=0;i < verts;i++){graph[i] = new Array(verts);}

pos = []
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
for (i=0;i < verts;i++){
  pos.push({name: alphabet[i],x:Math.floor((Math.random() * canvas.width) + 1), y: Math.floor((Math.random() * canvas.height) + 1)})
}

for (i=0;i < verts;i++){
  for (j=0;j < verts;j++){
    if (i != j){
      graph[i][j] = dist(pos[i],pos[j])
    }
  }
}

djikstra(graph,"a")

function djikstra(graph, start){
  removable = graph.slice(0);
  j = alphabet.indexOf(start)
  prev = alphabet.indexOf(start)
  for (i=0;i < graph.length;i++){
    sorted = removable[j].slice(0);
    sorted.sort(function(a, b){return a-b})
    j = removable[j].indexOf(sorted[0])
    removable[prev] = 0
    for (k=0;k < graph.length;k++){
      removable[k][prev] = Math.sqrt(Math.pow(canvas.width,2)+Math.pow(canvas.height,2))
    }
    prev = j
    console.log(removable.slice(0))
    console.log(j)
  }
}
function loop(){

}
setInterval(loop, 15);
