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
function renderAxes(newXScale, xAxis) {
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
        .range([0, width]);  //width define at beginning of main code

    return YLinearScale;

}

// function used for updating YAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yaxis;
}

// function used for updating circles group with a transition to
// new circles upon click on axis label
function renderCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newXScale(d[chosenYAxis]));

    return circlesGroup;
}


function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis) {

    textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return textcirclesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;

    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty (%)";
    }
    else {
        xlabel = "Age (Median)";
    }

    var ylabel;
    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Healthcare (%)";
    
    } else {
        ylabel = "Smokes (%)"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
    
                return (`${d.state}<br> ${xlabel}: ${chosenXAxis}%<br> ${ylabel}: ${chosenYAxis}%`);
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
    bottom: 80,
    left: 100
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
var chosenYAxis = "heatlhcare";
console.log(d3.csv("assets/data/data.csv"))

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (healthData, err) {
    if (err) throw err;

    // parse data - set values to numerical data types
    healthData.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.smokes = +data.smokes;
    });




    // #################### 5.  chartGroup Append Title   ###############//

// DON'T THINK I NEED THIS FOR CHANGING X AND Y AXIS
    // // append y title to left side of chartGroup
    // var yTitle = chartGroup.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("Lacks Healthcare (%)");



    // #################### 6.  chartGroup Append xAxis Object  ###############//

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


    // #################### 7.  chartGroup Append yAxis Object  ###############//

    var yLinearScale = xScale(healthData, chosenYAxis);
    // Create initial axis functions; generates the scaled axis
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis; adds x axis chart data tick marks to chartgroup
    // for future axis value changes then the renderAxes() function needs called
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(leftAxis);




    // #################### 8.  chartGroup Append cirlclesGroupAll Object  ###############//

    var circlesGroupAll = chartGroup
        .selectAll("circlesGroup")
        .data(healthData)
        .enter()



    // #################### 8A.  circlesGroupAll Append cirlcles Object  ###############//


    var circlesGroup = circlesGroupAll
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // #################### 8B.  circlesGroupAll Append text Object  ###############//

    var textcirclesGroup = circlesGroupAll
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]) - 8)
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
        .attr("font-size", "10px");

    // #################### 9.  chartGroup Append labelsGroup Object  ###############//
    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

     // Create group for two x-axis labels
     var ylabelsGroup = chartGroup.append("g")
     .attr("transform", `translate(${width / 2}, ${height + 20})`);


    // #################### 9A.  labelsGroup Append xlabel Object  ###############//

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");


    // #################### 9B.  labelsGroup Append xlabel Object  ###############//

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");
    
    var ageLabel = ylabelsGroup.append("text")
        .attr("x", 40)
        .attr("y", 0)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");


    // #################### 10.  circlesGroup/Tooltip - no clue why it is this way  ###############//
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    var textcirclesGroup = updateToolTip(chosenXAxis, chosenYAxis, textcirclesGroup)





    // #################### 11.  ADD updates upon clicking axis text  ###############//

    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(healthData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                // New - updates text labels within circles
                textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                textcirclesGroup = updateToolTip(chosenXAxis, textcirclesGroup)

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
 ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {

                // replaces chosenYAxis with value
                chosenYAxis = value;

                console.log(chosenYAxis)

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = xScale(healthData, chosenYAxis);

                // updates y axis with transition
                yAxis = renderAxes(yLinearScale, yAxis);

                // updates circles with new y values
                circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
                // New - updates text labels within circles
                textcirclesGroup = rendertextCircles(textcirclesGroup, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
                textcirclesGroup = updateToolTip(chosenYAxis, textcirclesGroup)

                // changes classes to change bold text
                if (chosenyAxis === "smokes") {
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (error) {
    console.log(error);
});
