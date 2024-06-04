// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Metadata:", data.metadata); // Debugging line
    var metadata = data.metadata;
    
    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log("Selected Metadata:", result); // Debugging line
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panel.html("");
    
    // Inside a loop, append new tags for each key-value in the filtered metadata
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }).catch(error => console.error('Error fetching metadata:', error));
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log("Samples Data:", data.samples); // Debugging line
    var samples = data.samples;
    
    // Filter the samples for the object with the desired sample number
    var result = samples.filter(sampleObj => sampleObj.id == sample)[0];
    console.log("Selected Sample Data:", result); // Debugging line
    
    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    console.log("OTU IDs:", otu_ids); // Debugging line
    console.log("OTU Labels:", otu_labels); // Debugging line
    console.log("Sample Values:", sample_values); // Debugging line

    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };
    var bubbleData = [
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
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);
  }).catch(error => console.error('Error fetching samples:', error));
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log('All Data:', data); // Debugging line
    var names = data.names;
    console.log('Sample Names:', names); // Debugging line
    
    // Use d3 to select the dropdown with id of `#selDataset`
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    names.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Get the first sample from the list
    var firstSample = names[0];
    console.log('First Sample:', firstSample); // Debugging line
    
    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }).catch(error => console.error('Error fetching names:', error));
}

// Function for event listener
function optionChanged(newSample) {
  console.log('New Sample Selected:', newSample); // Debugging line
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
