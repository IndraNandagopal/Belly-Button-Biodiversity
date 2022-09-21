//Build function to read json file using d3
function buildPlots(id) {
    
    d3.json("../../samples.json").then((data) => {
         
        var metadata = data.metadata;
        console.log(metadata);

        var samples = data.samples;
        console.log(samples);

        // Filter Metadata by subject ID
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == id)[0]
        console.log(filteredMetadata);

        // Filter Samples by subject ID
        var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == id)[0]
        console.log(filteredSample);

        // Create variables for bar chart & bubble chart
        // get the sample_values for the top 10 OTU ids for the bar chart
        var sample_values = filteredSample.sample_values
        var Top10_sample_values = filteredSample.sample_values.slice(0, 10).reverse()
        console.log(sample_values);

        // Use otu_ids as the labels for bar chart & bubble chart
        var otu_ids = filteredSample.otu_ids
        var Top10_otu_ids = filteredSample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse()
        
        console.log(otu_ids);

        // use otu_labels as the hovertext for bar chart & bubble chart
        var otu_labels = filteredSample.otu_labels
        console.log(otu_labels);

        // Create the trace for Bar chart
        var bar_trace = [{
            // Use otu_ids for the x values
            
            x: Top10_sample_values,
            // Use sample_values for the y values
            y: Top10_otu_ids,
            // Use otu ids
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]
        
        // Define bar layout
        var bar_layout = {
            title: "Top 10 Microbial Species in Belly Buttons",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // Display plot
        Plotly.newPlot('bar', bar_trace, bar_layout)

        // Build a Bubble Chart
        var bubble_trace = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
            
        ];
        var bubble_layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: { title: "Sample Values" },
            height: 600,
            width: 1000
        };
        
        Plotly.newPlot("bubble", bubble_trace, bubble_layout);

        // GAUGE CHART
        // Create variable for washing frequency
        var washFreq = filteredMetadata.wfreq

        // Create the trace
        var gauge_data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: "Washing Frequency (Times per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 3], color: 'rgb(253, 162, 73)' },
                        { range: [3, 6], color: 'rgb(242, 113, 102)' },
                        { range: [6, 9], color: 'rgb(166, 77, 104)' },
                    ],
                    // threshold: {
                    //     line: { color: "white" },
                    // }
                }
            }
        ];

        // Define Plot layout
        var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    });
};

function DemographicInfo(id) {
   d3.json("samples.json").then(data => {

    // get the metadata info for the demographic Info section
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == id)[0]

        console.log(filteredMetadata)
        var demographic_Info = d3.select("#sample-metadata");

        // empty the demographic info section each time before getting new id info
        demographic_Info.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(filteredMetadata).forEach((key) => {   
            demographic_Info.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    })
};

// Display the sample metadata, i.e., an individual's demographic information.
//create a function for the change in option

function optionChanged(id) {
    buildPlots(id);
    DemographicInfo(id);
}

//function to initial setting up of Dashboard
function init_Dashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        
        // get the id data to the dropdwown menu
        var id = data.names;
        id.forEach(id => {
            dropdown.append("option").text(id).property("value", id)
        });
        buildPlots(id[0]);
        DemographicInfo(id[0]);
    });
};

//Calling init_Dashboard function
init_Dashboard();
