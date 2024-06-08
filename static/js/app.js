// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
 
    // get the metadata field
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filtereddata = metaData.filter(item => item.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filtereddata).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSamples = samples.filter(item => item.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSamples.otu_ids;
    let otu_labels = filteredSamples.otu_labels;
    let sample_values = filteredSamples.sample_values;
    console.log("OTU IDs:", otu_ids); console.log("Sample Values:", sample_values); console.log("OTU Labels:", otu_labels);
    
    // Build a Bubble Chart
    let trace1 = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    //Creat a bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'Number of Bacteria'},
      yaxis: {title: 'OTU ID'}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", trace1, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace2 = [{ x: sample_values.slice(0, 10).reverse(), y: yticks, text: otu_labels.slice(0, 10).reverse(), type: 'bar', orientation: 'h' }];
    

    // Margin layout for x-tick labels
    let bar_layout = {
      title: "Top 10 Bacteria.Cultures Found",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", trace2, bar_layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select(`#selDataset`);


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name =>{dropdown.append("option").text(name).property("value", name);});

    // Get the first sample from the list
    let sample_list = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(sample_list);
    buildMetadata(sample_list);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
