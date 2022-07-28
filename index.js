    window.addEventListener("DOMContentLoaded", function()
    {
        console.debug("DOMContentLoaded");
		const clickme = document.getElementById("clickme")

		if (clickme) clickme.addEventListener('click', function(event)
		{
			const upload = document.getElementById("load-midifile");

			if (upload) upload.addEventListener('change', function(event)
			{
				uploadMidifile(event);
			});
			upload.click();	
		})
	});

function uploadMidifile(event)
{
	var files = event.target.files;

	for (const file of files)
	{
		var reader = new FileReader();

		reader.onload = function(event)
		{
			handleMidi(file, event.target.result);
		};

		reader.onerror = function(event) {
			console.error("uploadMidifile - error", event);
		};

		reader.readAsArrayBuffer(file);
	}
}

function handleMidi(file, input)
{
	console.log("input", input);
	
	var parsed = parseMidi(input)
	console.log("parsed", parsed);
	
	var output = writeMidi(parsed)
	console.log("output", output);	
	
	var u8 = new Uint8Array(output.length)

	for(var i=0;i<output.length;i++){
	  u8[i] = output[i];
	}	
	
	var blob = new Blob([u8], {type:'audio/midi'});
	console.log("blob", blob);
	
	createAnchor(file.name + ".kst", blob)	
}

function createAnchor(filename, blob)
{
	const anchor = document.createElement('a');
	anchor.href = window.URL.createObjectURL(blob);
	anchor.style = "display: none;";
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	window.URL.revokeObjectURL(anchor.href);
}