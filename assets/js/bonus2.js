function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.9,
        d3.max(healthData, d => d[chosenXAxis]) * 1.1
        ])
        .range([0, width]);  //width define at beginning of main code

    return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.9,
        d3.max(healthData, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);  //width define at beginning of main code

    return yLinearScale;

}

// function used for updating YAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles upon click on axis label
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}


function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textcirclesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    

    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty (%)";
    }
    else if(chosenXAxis === "income")
        xlabel= "Income: $";

    else { 
        xlabel = "Age (Median)";
    }

    var ylabel;
    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Healthcare (%)";

    } 
    
    else if (chosenYAxis === "smokes"){
        ylabel = "Smoke (%)"
    }
    else { 
        ylabel = "Obesity: "
    }
    
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        //.offset([80, -60])
        .style("font-size", "8px")
        .html(function (d) {
            return (`${d.state}<br> ${xlabel}: ${d[chosenXAxis]}<br> ${ylabel}: ${d[chosenYAxis]}`)
        });


    circlesGroup.call(toolTip);


    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}




//########################  3.  SVG Setup ###################################//

var svgWidth = 1100;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 150,
    left: 150
};

// xScale uses width so xScale() can only be called below this point
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);







// #################### 4.  BRING in Data  ###############//

// Initial Params - includes any axis selection that has multiple options
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
//console.log(d3.csv("assets/data/data.csv"))

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (healthData, err) {
    if (err) throw err;

    // parse data - set values to numerical data types
    healthData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.income = +data.income;
    });






    // #################### 5.  chartGroup Append xAxis Object  ###############//

    // xLinearScale function above csv import; Note:  xLinearScale is a function contains scaled data specific to the defined axis

    var xLinearScale = xScale(healthData, chosenXAxis);
    // Create initial axis functions; generates the scaled axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    // append x axis; adds x axis chart data tick marks to chartgroup
    // for future axis value changes then the renderAxes() function needs called
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);


    // #################### 6.  chartGroup Append yAxis Object  ###############//

    var yLinearScale = yScale(healthData, chosenYAxis);
    // Create initial axis functions; generates the scaled axis
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis; adds x axis chart data tick marks to chartgroup
    // for future axis value changes then the renderAxes() function needs called
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);




    // #################### 7.  chartGroup Append cirlclesGroupAll Object  ###############//

    // var circlesGroupAll = chartGroup
    //     .selectAll("circlesGroup")
    //     .data(healthData)
    //     .enter()



    // #################### 7A.  circlesGroupAll Append cirlcles Object  ###############//


    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("class","stateCircle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        // .attr("fill", "pink")
        .attr("opacity", ".5");

    // #################### 7B.  circlesGroupAll Append text Object  ###############//

    var textcirclesGroup = chartGroup.selectAll("abbr")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("class", "stateText")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("font-size", "10px");

    // #################### 8.  chartGroup Append labelsGroup Object  ###############//
    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);



    // #################### 8A.  labelsGroup Append xlabel Object  ###############//

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");


    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

        
    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income Median $");
    
    // Create group for two y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
    //.attr("transform", `translate(${width / 2}, ${height + 20})`);


    var healthcareLabel = ylabelsGroup.append("text")
        .attr("value", "healthcare") // value to grab for event listener
        .attr("dx", "-10em")
        .attr("dy", "-2em")
        .classed("active", true)
        .text("Lacks Healthcare (%)");


    // ####################   labelsGroup Append ylabel Object  ###############//


    var smokesLabel = ylabelsGroup.append("text")
        .attr("value", "smokes") // value to grab for event listener
        .attr("dx", "-10em")
        .attr("dy", "-4em")
        .classed("inactive", true)
        .text("Smokes (%)");


    var obeseLabel = ylabelsGroup.append("text")
        .attr("value", "obesity") // value to grab for event listener
        .attr("dx", "-10em")
        .attr("dy", "-6em")
        .classed("inactive", true)
        .text("Obese (%)");


    // #################### 9.  circlesGroup/Tooltip  ###############//






    // #################### 10.  ADD updates upon clicking axis text  ###############//

    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var xvalue = d3.select(this).attr("value");
            if (xvalue !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = xvalue;

                console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                xLinearScale = xScale(healthData, chosenXAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // New - updates text labels within circles
                textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
                //textcirclesGroup = updateToolTip(chosenXAxis, chosenYAxis, textcirclesGroup)

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else if(chosenXAxis === "income"){
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);

                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var yvalue = d3.select(this).attr("value");
            if (yvalue !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenYAxis = yvalue;

                console.log(chosenYAxis)

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(healthData, chosenYAxis);

                // updates y axis with transition
                yAxis = renderAxesY(yLinearScale, yAxis);

                // updates circles with new y values
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // New - updates text labels within circles
                textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "smokes") {
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "healthcare") {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", false)
                        .classed("inactive", true)

                }
                else {
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                   healthcareLabel
                        .classed("active", false)
                        .classed("inactive", false);
                    obeseLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});
