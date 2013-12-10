Dynomap
-------
Dynomap is a responsive image map plugin that allows for multiple states of when interacting with areas on the map and custom callbacks.


Initializer
--------------

This is the minimal you need to initialize the `Dynomap` Plugin

	$(".dynomap").dynomap({
		"background": {
			"image": "auth/asset/samples/map.jpg"
		},
		"hotSpots": [
			{
				"area": "coordinates for image map"
			}
		]
	});
	
And here is the full set of available configurables as a initilizer

	$(".dynomap").dynomap({
		"background": {
			"image": "auth/asset/samples/map.jpg",
            "title": "alt and title attributes for image"
		},
		"hotSpots": [
			{
				"area": "coordinates for image map",
				"title": "alt and title attributes for area",
				"overImg": "path to image",
				"downImg": "path to image",
				"clickedImg": "path to image",
				"visitedImg": "path to image"
			}
		],
		clicked : function ($this, index) {/*callback function when area is clicked*/}
	});

	
Requirement
--------------
The images that are used for background, overImg, downImg, clickedImg, visitedImg all have to be same in dimension.
The image map area coordinates are given based on the original dimensions of the background image.
Look at the demos as reference material. 
	
	
CallBack
--------------
When initializing Dynomap Plugin you have the option of creating a callback function. 
This call back function comes with two parameters. One being your Dom Node and the other being the index of 
which area you clicked. 


Demos
--------------
Visit http://rijaddizdarevic.com/demo to find demos.


Browser Support
---------------
Tested on the these systems and browsers
Windows 7
- IE Ver 10
- Firefox Ver.25
- Chrome Ver.6
Mac OSX 10.8 
- Chrome Ver.31
- Firefox Ver.25
- Safari Ver.6
Ipad 2 IOS 7
- Chrome 
- Safari	