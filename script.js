const datasetGDP = [];
const datasetYears = [];

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
	.then(response => response.json())
	.then(data => {
    for (let d of data.data) {
      datasetGDP.push(d[1]);
      let year = d[0].split("-")[0];
      if (d[0].split("-")[1] === "04") {
        year += ".25";
      } else if (d[0].split("-")[1] === "07") {
        year += ".50";
      } else if (d[0].split("-")[1] === "10") {
        year += ".75";
      }
      datasetYears.push(Number(year));
    }
    createBarChart();
	});

function createBarChart() {
  const w = 940;
  const h = 600;
  const paddingLeft = 80;
  const paddingRight = 60;
  const paddingTop = 105;
  const paddingBottom = 95;
  const chartW = w - paddingLeft - paddingRight;
  const chartH = h - paddingTop - paddingBottom;
  const rectW = chartW / datasetGDP.length;
  const minYear = d3.min(datasetYears);
  const maxYear = d3.max(datasetYears);
  const maxGDP = d3.max(datasetGDP);

  const xScale = d3.scaleLinear()
                    .domain([minYear, maxYear])
                    .range([paddingLeft, w - paddingRight]);
  
  const yScale = d3.scaleLinear()
                     .domain([0, maxGDP])
                     .range([h - paddingTop, paddingBottom]);
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3.select("#barChart")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .style("background","white")
  .style("box-shadow","1px 1px 10px #222, -1px -1px 10px #222");
  
  svg.selectAll("rect")
    .data(datasetGDP)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * rectW + paddingLeft)
    .attr("y", (d, i) => h - d/maxGDP*chartH - paddingTop)
    .attr("width", rectW)
    .attr("height", (d, i) => d/maxGDP*chartH)
    .attr("fill","#33ADFF")
    .attr("class","turnWhite");
  
  svg.selectAll("rect .textBackground")
    .data(datasetGDP)
    .enter()
    .append("rect")
    .attr("class","textBackground")
    .attr("x", (d, i) => i * rectW + paddingLeft + 31)
    .attr("y", 392)
    .attr("width", 152)
    .attr("height", 56)
    .attr("fill","lightsteelblue")
    .attr("filter","drop-shadow(1px 1px 4px)")
    .style("opacity",0.9)
    .style("box-shadow", "5px 5px 1px #000")
    .style("display", "none");
  
  svg.selectAll("text")
    .data(datasetGDP)
    .enter()
    .append("text")
    .text((d,i) =>  datasetYears[i].toString().slice(0,4) + " Q"+ whatQ(datasetYears[i]))
    .attr("x", (d,i) => i * rectW + paddingLeft + 77)
    .attr("y", 416)
    .style("opacity", 1)
    .style("font-size",16)
    .style("font-weight",300)
    .style("font-family","Roboto")
    .style("display","none");
  
  function whatQ(year) {
    if (year.toString().slice(-3) === ".25") {
      return 2;
    } else if (year.toString().slice(-2) === ".5") {
      return 3;
    } else if (year.toString().slice(-3) === ".75") {
      return 4;
    } else {
      return 1;
    }
  }
  
   
  svg.selectAll("text .secondaryText")
    .data(datasetGDP)
    .enter()
    .append("text")
    .text((d,i) =>  "$" + d + " Billion")
    .attr("x", (d,i) => i * rectW + paddingLeft + 57)
    .attr("y", 436)
    .style("font-size",16)
    .style("font-weight",300)
    .style("font-family","Roboto")
    .style("opacity", 1)
    .attr("class","secondaryText")
    .style("display","none");
  
  svg.append("g")
    .attr("transform", "translate(0," + (h - paddingTop) + ")")
    .call(xAxis);
  
  svg.append("g")
    .attr("transform", "translate(" + paddingLeft + ",0)")
    .call(yAxis);
  
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -295)
    .attr('y', 100)
    .text('Gross Domestic Product')
    .style('font-weight','300');
  
  svg.append('text')
    .attr('x', w - 400)
    .attr('y', h - 50)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .style('font-size','0.8em')
    .style('font-weight','300');
  
  
      const allRects = document.querySelectorAll('.turnWhite');
      console.log(allRects);
  
      for (let i = 0; i < allRects.length; i++) {
        allRects[i].addEventListener("mouseover", () => {
          const textGPD = document.querySelectorAll(`text`)[i];
          const textGPD2 = document.querySelectorAll(".secondaryText")[i];
          const textBG = document.querySelectorAll(".textBackground")[i];
          textGPD.style.display = "inline";
          textGPD2.style.display = "inline";
          textBG.style.display = "block";
        });
        allRects[i].addEventListener("mouseout", () => {
          const textGPD = document.querySelectorAll(`text`)[i];
          const textGPD2 = document.querySelectorAll(".secondaryText")[i];
          const textBG = document.querySelectorAll(".textBackground")[i];
          textGPD.style.display = "none";
          textGPD2.style.display = "none";
          textBG.style.display = "none";
        });
      };
}