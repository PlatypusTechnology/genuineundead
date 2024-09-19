
window.initWebGL = function (links, div, cy) {
	const currentUrl = new URL(window.location.href);
	if (window.reader) return;
	window.reader = true;
	// Extract search parameters
	const searchParams = currentUrl.searchParams;
	webGlDiv = div;
	fov = 30;
	if (searchParams.has("fov")) {
		fov = (Number(searchParams.get("fov").toString()))
	}
	cameraY = (cy == undefined || isNaN(cy)) ? 0 : cy;
	mousePosition = new Point(0, 0);
	lastMousePosition = new Point(0, 0);
	mousePositionOnMouseDown = new Point(0, 0);
	focusPoint = new THREE.Vector3(0, 0, 0);
	if (searchParams.has("fx") && searchParams.has("fy")) {
		focusPoint.x = Number(searchParams.get('fx'))
		focusPoint.y = Number(searchParams.get('fy'))
	}

	book = null;
	mouseWheelEvent = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	scene = null;


	/*
	setDivSize();
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	stats.domElement.style.borderTop = '6px solid #000022'; 
	document.body.appendChild( stats.domElement );
	*/

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	screen.orientation.lock('landscape');

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(document.getElementById(webGlDiv).clientWidth, document.getElementById(webGlDiv).clientHeight);

	camera = new THREE.PerspectiveCamera(20, document.getElementById(webGlDiv).clientWidth / document.getElementById(webGlDiv).clientHeight, 1, 1000);
	camera.position.set(0, cameraY, 500);


	scene = new THREE.Scene();
	scene.add(camera);
	camera.lookAt(scene.position);
	if (searchParams.has("x") && searchParams.has("y") && fov < 24) {
		camera.position.setX(Number(searchParams.get('x')))
		camera.position.setY(Number(searchParams.get('y')))
	}
	//document.getElementById('info').innerHTML="Turn page by draging its edge. Use mouse wheel for zoom.";			
	document.getElementById(webGlDiv).appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
	document.getElementById(webGlDiv).addEventListener('mousedown', onMouseDown, false);
	document.getElementById(webGlDiv).addEventListener('touchstart', onMouseDown, false);
	document.getElementById(webGlDiv).addEventListener(mouseWheelEvent, zoom, false);

	//  BOOK   **************************
	book = new Book(links);
	window.book = book;

	for (var i = 0; i < book.pages.length; i++) {
		scene.add(book.pages[i].fakePage);
	}

	// Check if a parameter exists
	if (searchParams.has("page")) {
		jump(Number(searchParams.get("page").toString()) )
	} else jump(0)
	camera.projectionMatrix = THREE.Matrix4.makePerspective(fov, document.getElementById(webGlDiv).clientWidth / document.getElementById(webGlDiv).clientHeight, 1, 1000);



	registerArrowPageChange();
	document.getElementById('pageLeft').addEventListener('click', () => book.flipToLeft());
	document.getElementById('pageRight').addEventListener('click', () => book.flipToRight());

	//updatePagesInfo();
	animate();
}
function pageSwitchEvent(event) {
	if (event.keyCode === 39) book.flipToRight();
	if (event.keyCode === 37) book.flipToLeft();
}

function registerArrowPageChange() {
	document.addEventListener('keydown', pageSwitchEvent,);
}

Page = function (id, frontImage, backImage, onLoadCallback) {
	this.id = id;
	this.mesh = null;
	this.width = 145;
	this.heigth = 232;
	this.offset = 0;
	this.force = 0;
	this.angle = 90;
	this.maxAngle = 75;
	this.rotation = 0;
	this.curlProgress = 0;
	this.counter = 0;
	this.materials = [];
	this.isTurnedLeft = true;
	this.rotationCompleted = true;
	this.mod = null;
	this.bend = null;
	this.fakePage = new THREE.Object3D();
	var textureFront, textureBack;


	if (frontImage != undefined) textureFront = THREE.ImageUtils.loadTexture(frontImage, {}, onLoadCallback);
	if (backImage != undefined) textureBack = THREE.ImageUtils.loadTexture(backImage, {}, onLoadCallback);

	for (var i = 0; i < 6; i++) {
		if (i < 4) this.materials[i] = new THREE.MeshBasicMaterial({ color: 0x333 });
		if (i == 4) this.materials[i] = textureFront == undefined ? new THREE.MeshBasicMaterial({ color: 0xa1a1a1 }) : new THREE.MeshBasicMaterial({
			map: textureFront, transparent: true, // Enable transparency
			alphaTest: 0.5, // Adjust the threshold to control transparency (0: fully transparent, 1: fully opaque)
		});
		if (i == 5) this.materials[i] = textureBack == undefined ? new THREE.MeshBasicMaterial({ color: 0xa1a1a1 }) : new THREE.MeshBasicMaterial({
			map: textureBack,
			transparent: true, // Enable transparency
			alphaTest: 0.5, // Adjust the threshold to control transparency (0: fully transparent, 1: fully opaque)
		});
	}

	var pageGeometry = new THREE.CubeGeometry(this.width, this.heigth, 0.1, 15, 23, 1, this.materials);
	this.mesh = new THREE.Mesh(pageGeometry, new THREE.MeshFaceMaterial());
	this.mesh.position.x = -(this.width / 2);
	this.fakePage.add(this.mesh);

	this.mod = new MOD3.ModifierStack(new MOD3.LibraryThree(), this.mesh);
	this.bend = new MOD3.Bend(0, 1, 0);
	this.bend.constraint = MOD3.ModConstant.LEFT;
	this.mod.addModifier(this.bend);
	//this.mod.apply();

	// Methods
	this.setRotation = function (rot) {
		this.rotation = rot;
		this.fakePage.rotation.y = this.rotation;
	}

	this.setZ = function (z) {
		this.fakePage.position.z = z;
	}

	this.getZ = function () {
		return this.fakePage.position.z;
	}

	this.applyDeformation = function () {
		this.bend.force = this.force;
		this.bend.offset = this.offset;
		this.bend.setAngle(this.angle * Math.PI / 180);
		this.fakePage.rotation.y = this.rotation;
		const p = this;
		const last = this.id === Math.floor(book.numberOfPages / 2);
		if (this.id === 0 || last ) {
			if ((!book.leftPage || !book.rightPage) && this.curlProgress === 0 && (last ?  this.rotation === 0 : this.rotation !== 0) ) {
				const t = { x: camera.position.x }
				// It means the book is being closed
				gsap.to(t, {
					duration: 0.5, // Duration of the animation in seconds
					ease: "Power2.easeOut", // Easing function
					onUpdate: function () {
						camera.position.set(t.x, cameraY, 500);
					},
					x: p.width / 2 * (last ? -1 : 1) // Animate x from its current value to the width of the window
				});

			} else if ((book.leftPage || book.rightPage) && this.curlProgress === 0 && (last ?  this.rotation !== 0 : this.rotation === 0)) {
				const t = { x: camera.position.x }
				// It means the book is being open
				gsap.to(t, {
					duration: 0.5, // Duration of the animation in seconds
					ease: "Power2.easeOut", // Easing function
					onUpdate: function () {
						camera.position.set(t.x, cameraY, 500);
					},

					x: 0 // Animate x from its current value to the width of the window
				});

			}
		}
	}

	this.setDefaults = function () {
		this.offset = 0;
		this.force = 0;
		this.angle = 90;
		this.maxAngle = 75;
		this.curlProgress = 0;
		this.counter = 0;
	}

	this.setDeformation = function (mpx, mpy, mpomdx, lastmpy) {
		if (this.isTurnedLeft) {
			if (mpx - mpomdx < 300) {
				if (mpx - mpomdx < 0) {
					mpomdx = mpx;
					this.curlProgress = 0;
					this.rotation = 0;
					this.offset = 1;
					this.force = 0;
					this.angle = 90;
				}
				else {
					if (this.counter === 0) {
						if (lastmpy - mpy == 0 && ((this.angle < 90 - this.maxAngle) || (this.angle > 90 + this.maxAngle))) this.angle = (this.angle > 90) ? 90 + this.maxAngle : 90 - this.maxAngle;
						if (lastmpy - mpy < 0) this.angle = (this.angle > 90 - this.maxAngle) ? this.angle - 1 : 90 - this.maxAngle;
						if (lastmpy - mpy > 0) this.angle = (this.angle < 90 + this.maxAngle) ? this.angle + 1 : 90 + this.maxAngle;
						if (this.angle === 90) this.counter = 10;
					}
					else {
						this.counter--;
					}
					this.offset = 0.9 - (0.7 * (mpx - mpomdx) / 300);
					this.force = -3.2 + (1.5 * (mpx - mpomdx) / 300);
					this.maxAngle = 75 - 70 * (mpx - mpomdx) / 300;
					this.curlProgress = mpx - mpomdx;
				}
			}


			if ((mpx - mpomdx) >= 300 && (mpx - mpomdx) <= 600) {
				this.rotation = (mpx - mpomdx - 300) * Math.PI / 300;
				this.offset = (0.2 + (0.1 * (mpx - mpomdx - 300) / 300) < 0.3) ? 0.2 + 0.1 * (mpx - mpomdx - 300) / 300 : 0.3;
				this.maxAngle = 5 + 10 * (mpx - mpomdx - 300) / 300;

				this.curlProgress = mpx - mpomdx;

				if (lastmpy - mpy < 0) this.angle = (this.angle > 90 - this.maxAngle) ? this.angle - 1 : 90 - this.maxAngle;
				if (lastmpy - mpy > 0) this.angle = (this.angle < 90 + this.maxAngle) ? this.angle + 1 : 90 + this.maxAngle;

				if (mpx - mpomdx < 450) {
					this.force = (-1.8 + 0.6 * (mpx - mpomdx - 300) / 150);
				}
				else {
					this.force = (-1.2 + 1.2 * (mpx - mpomdx - 450) / 150 < 0) ? -1.2 + 1.2 * (mpx - mpomdx - 450) / 150 : 0;
				}
			}

			if (mpx - mpomdx > 600) {
				mpomdx = mpx - 600;
				this.curlProgress = 600;
				this.rotation = Math.PI;
				this.offset = 0;
				this.force = 0;
				this.angle = 90;
			}

		}

		else {
			if (mpx - mpomdx > -300) {
				if (mpx - mpomdx > 0) {
					mpomdx = mpx;
					this.curlProgress = 0;
					this.rotation = Math.PI;
					this.offset = 0;
					this.force = 0;
					this.angle = 90;
				}
				else {
					if (this.counter === 0) {
						if (lastmpy - mpy == 0 && ((this.angle < 90 - this.maxAngle) || (this.angle > 90 + this.maxAngle))) this.angle = (this.angle > 90) ? 90 + this.maxAngle : 90 - this.maxAngle;
						if (lastmpy - mpy < 0) this.angle = (this.angle > 90 - this.maxAngle) ? this.angle - 1 : 90 - this.maxAngle;
						if (lastmpy - mpy > 0) this.angle = (this.angle < 90 + this.maxAngle) ? this.angle + 1 : 90 + this.maxAngle;
						if (this.angle === 90) this.counter = 10;
					}
					else {
						this.counter--;
					}

					this.curlProgress = mpx - mpomdx;
					this.offset = 0.9 + (0.7 * (mpx - mpomdx) / 300);
					this.force = 3.2 + (1.5 * (mpx - mpomdx) / 300);
					this.maxAngle = 75 + 70 * (mpx - mpomdx) / 300;
				}
			}

			if (mpx - mpomdx <= -300 && mpx - mpomdx >= -600) {
				this.rotation = Math.PI + (mpx - mpomdx + 300) * Math.PI / 300;
				this.offset = (0.2 - 0.1 * (mpx - mpomdx + 300) / 300 < 0.3) ? 0.2 - (0.1 * (mpx - mpomdx + 300) / 300) : 0.3;
				this.maxAngle = 5 - 10 * (mpx - mpomdx + 300) / 300;

				this.curlProgress = mpx - mpomdx;

				if (lastmpy - mpy < 0) this.angle = (this.angle > 90 - this.maxAngle) ? this.angle - 1 : 90 - this.maxAngle;
				if (lastmpy - mpy > 0) this.angle = (this.angle < 90 + this.maxAngle) ? this.angle + 1 : 90 + this.maxAngle;

				if (mpx - mpomdx > -450) {
					this.force = (1.7 + 0.6 * (mpx - mpomdx + 300) / 150);
				}
				else {
					this.force = (1.1 + 1.1 * (mpx - mpomdx + 450) / 150 > 0) ? 1.1 + 1.1 * (mpx - mpomdx + 450) / 150 : 0;
				}
			}

			if (mpx - mpomdx < -600) {
				mpomdx = mpx + 600;
				this.curlProgress = -600;
				this.rotation = 0;
				this.offset = 0;
				this.force = 0;
				this.angle = 90;
			}
		}
		this.applyDeformation();
	}
}

Book = function (images) {
	this.numberOfPages = images.length;
	this.pages = Math.ceil(this.numberOfPages / 2) < 6 ? new Array(Math.ceil(this.numberOfPages / 2)) : new Array(6);
	this.leftPage = null;
	this.rightPage = null;
	this.currentPage = null;
	this.removedPage = null;
	this.images = [];


	this.initialLoad = true;

	this.pagesLoaded = 0;

	this.bookLoaded = () => {

		document.getElementById('loader').style.opacity = 0
		document.getElementById('loader').style.pointerEvents = 'none'
		document.getElementById('infos').style.opacity = 1
		document.getElementById('infos').style.pointerEvents = 'all'
		updatePagesInfo()
	}

	this.pageLoaded = () => {

		this.pagesLoaded += 1;
		if (this.pagesLoaded > 4) {

			this.bookLoaded()
		}
	}
	for (var i = 0; i < this.numberOfPages; i += 2) {
		this.images.push({ back: images[i], front: images[i + 1] });
	}

	for (var i = 0; i < this.pages.length; i++) {
		this.pages[i] = new Page(i, this.images[i].front, this.images[i].back, this.pageLoaded);
		if (i > 0) {
			this.pages[i].setRotation(Math.PI);
			this.pages[i].isTurnedLeft = false;
		}
		if (i == 0) {
			this.pages[i].setZ(-0.1 * (this.pages.length - 1));
		}
		else {
			this.pages[i].setZ(0.1 * (-i));
		}
	}

	this.leftPage = this.pages[0];
	this.rightPage = this.pages[1];


	// Methods
	this.selectPage = function (page) {
		if (!page) return;
		page.rotationCompleted = true;
		this.currentPage = page;
		page.setZ(0);
	}

	this.jumpToPage = function (number) {
		var index;
		var turnedLeft;
		if (number < 0 || number > this.numberOfPages + 2) {
			alert('Requested page does not exist. This book has ' + this.numberOfPages + ' pages.');
		}
		else {
			index = Math.floor(number / 2);
			turnedLeft = (number % 2 == 0) && index >0 ? true : false;

			// left: 3 pages right: 3 pages turned: left
			if (index > 1 && index < this.images.length - 3 && turnedLeft) {
				for (var i = index - 2, j = 0; i < index + 4; i++, j++) {
					this.pages[j] = new Page(i, this.images[i].front, this.images[i].back);
					if (j > 2) {
						this.pages[j].setRotation(Math.PI);
						this.pages[j].isTurnedLeft = false;
						this.pages[j].setZ(-0.1 * j);
					}
					else this.pages[j].setZ(0.1 * j - 0.1 * (this.pages.length - 1));
				}
				this.leftPage = this.pages[2];
				this.rightPage = this.pages[3];
			}
			// 3,3,right
			if (index > 2 && index < this.images.length - 2 && !turnedLeft) {
				for (var i = index - 3, j = 0; i < index + 3; i++, j++) {
					this.pages[j] = new Page(i, this.images[i].front, this.images[i].back);
					if (j > 2) {
						this.pages[j].setRotation(Math.PI);
						this.pages[j].isTurnedLeft = false;
						this.pages[j].setZ(-0.1 * j);
					}
					else this.pages[j].setZ(0.1 * j - 0.1 * (this.pages.length - 1));

				}
				this.leftPage = this.pages[2];
				this.rightPage = this.pages[3];
			}

			// 0,6
			if (index == 0 && !turnedLeft) {
				for (var i = 0; i < this.pages.length; i++) {
					this.pages[i] = new Page(i, this.images[i].front, this.images[i].back);

					this.pages[i].setRotation(Math.PI);
					this.pages[i].isTurnedLeft = false;
					this.pages[i].setZ(-i * 0.1);
				}
				this.leftPage = null;
				this.rightPage = this.pages[0];
			}
			// 1,5
			if (index == 0 && turnedLeft || index == 1 && !turnedLeft) {
				for (var i = 0; i < this.pages.length; i++) {
					this.pages[i] = new Page(i, this.images[i].front, this.images[i].back);
					if (i > 0) {
						this.pages[i].setRotation(Math.PI);
						this.pages[i].isTurnedLeft = false;
					}
					if (i == 0) {
						this.pages[i].setZ(-0.1 * (this.pages.length - 1));
					}
					else {
						this.pages[i].setZ(0.1 * (-i));
					}
				}
				this.leftPage = this.pages[0];
				this.rightPage = this.pages[1];
			}
			// 2,4
			if (index == 1 && turnedLeft || index == 2 && !turnedLeft) {
				for (var i = 0; i < this.pages.length; i++) {
					this.pages[i] = new Page(i, this.images[i].front, this.images[i].back);
					if (i > 1) {
						this.pages[i].setRotation(Math.PI);
						this.pages[i].isTurnedLeft = false;
						this.pages[i].setZ(-i * 0.1);
					}
					else {
						this.pages[i].setZ(0.1 * i - 0.1 * (this.pages.length - 1));
					}
				}
				this.leftPage = this.pages[1];
				this.rightPage = this.pages[2];
			}
			// 6,0
			if (index == this.images.length - 1 && turnedLeft) {
				for (var i = this.images.length - this.pages.length, j = 0; i < this.images.length; i++, j++) {
					this.pages[j] = new Page(i, this.images[i].front, this.images[i].back);
					this.pages[j].setZ(j * 0.1 - 0.1 * (this.pages.length - 1));
				}
				this.leftPage = this.pages[this.pages.length - 1];
				this.rightPage = null;
			}
			// 5,1
			if (index == this.images.length - 1 && !turnedLeft || index == this.images.length - 2 && turnedLeft) {
				for (var i = this.images.length - this.pages.length, j = 0; i < this.images.length; i++, j++) {
					this.pages[j] = new Page(i, this.images[i].front, this.images[i].back);
					if (j == this.pages.length - 1) {
						this.pages[j].setZ(-0.1 * (this.pages.length - 1));
						this.pages[j].setRotation(Math.PI);
						this.pages[j].isTurnedLeft = false;
					}
					else {
						this.pages[j].setZ(0.1 * j - 0.1 * (this.pages.length - 1));
					}
				}
				this.leftPage = this.pages[this.pages.length - 2];
				this.rightPage = this.pages[this.pages.length - 1];
			}
			// 4,2
			if (index == this.images.length - 2 && !turnedLeft || index == this.images.length - 3 && turnedLeft) {
				for (var i = this.images.length - this.pages.length, j = 0; i < this.images.length; i++, j++) {
					this.pages[j] = new Page(i, this.images[i].front, this.images[i].back);

					if (j > this.pages.length - 3) {
						this.pages[j].setZ(-0.1 * j);
						this.pages[j].setRotation(Math.PI);
						this.pages[j].isTurnedLeft = false;
					}
					else {
						this.pages[j].setZ(0.1 * j - 0.1 * (this.pages.length - 1));
					}

				}
				this.leftPage = this.pages[this.pages.length - 3];
				this.rightPage = this.pages[this.pages.length - 2];
			}

		}
	}

	this.autoCompleteRotation = function (page) {
		if (!page.rotationCompleted) {
			if (page.isTurnedLeft) {
				if (page.curlProgress < 300) {
					if (page.curlProgress <= 0) {
						page.rotationCompleted = true;
						page.setDefaults();
						page.rotation = 0;

						if (this.pages.indexOf(page) == 0) {
							page.setZ(-0.1 * (this.pages.length - 1));
						}
						else {
							page.setZ(this.pages[this.pages.indexOf(page) - 1].getZ() + 0.1);
						}

						if (this.currentPage === page) this.currentPage = null;

					}
					else {
						page.offset = 0.2 - (0.7 * (page.curlProgress - 300) / 300);
						page.force = -1.7 + (1.5 * (page.curlProgress - 300) / 300);
						page.curlProgress -= 10;
					}

				}
				else {
					if (page.curlProgress >= 600) {
						page.rotationCompleted = true
						page.setDefaults();
						page.rotation = Math.PI;
						page.isTurnedLeft = false;

						if (this.pages.indexOf(page) == this.pages.length - 1) {
							page.setZ(-0.1 * (this.pages.length - 1));
						}
						else {
							page.setZ(this.pages[this.pages.indexOf(page) + 1].getZ() + 0.1);
						}

						if (this.pages.indexOf(page) == 2 && this.pages[0].id > 0) {
							this.removedPage = this.pages.pop();
							for (var i = 0; i < this.pages.length; i++) {
								if (this.pages[i].isTurnedLeft) {
									this.pages[i].setZ(this.pages[i].getZ() + 0.1);
								}
								else {
									this.pages[i].setZ(this.pages[i].getZ() - 0.1);
								}
							}
							this.pages.unshift(new Page(this.pages[0].id - 1, this.images[this.pages[0].id - 1].front, this.images[this.pages[0].id - 1].back));
							this.pages[0].setZ(-0.5);
						}

						if (this.currentPage === page) this.currentPage = null;
						this.leftPage = this.pages[this.pages.indexOf(page) - 1];
						this.rightPage = page;
					}
					else {
						page.rotation = (page.curlProgress - 300) * Math.PI / 300;
						page.offset = (0.2 + (0.1 * (page.curlProgress - 300) / 300) < 0.3) ? 0.2 + 0.1 * (page.curlProgress - 300) / 300 : 0.3;
						if (page.curlProgress < 450) {
							page.force = (-1.8 + 0.6 * (page.curlProgress - 300) / 150);
						}
						else {
							page.force = (-1.2 + 1.2 * (page.curlProgress - 450) / 150 < 0) ? -1.2 + 1.2 * (page.curlProgress - 450) / 150 : 0;
						}
						page.curlProgress += 10;
					}
				}
			}

			else {
				if (page.curlProgress > -300) {
					if (page.curlProgress >= 0) {
						page.rotationCompleted = true;
						page.setDefaults();
						page.rotation = Math.PI;

						if (this.pages.indexOf(page) == this.pages.length - 1) {
							page.setZ(-0.1 * (this.pages.length - 1));
						}
						else {
							page.setZ(this.pages[this.pages.indexOf(page) + 1].getZ() + 0.1);
						}

						if (this.currentPage === page) this.currentPage = null;
					}
					else {
						page.offset = 0.2 + (0.7 * (page.curlProgress + 300) / 300);
						page.force = 1.7 + (1.5 * (page.curlProgress + 300) / 300);
						page.curlProgress += 10;
					}
				}
				else {
					if (page.curlProgress <= -600) {
						page.rotationCompleted = true
						page.setDefaults();
						page.rotation = 0;
						page.isTurnedLeft = true;

						if (this.pages.indexOf(page) == 0) {
							page.setZ(-0.1 * (this.pages.length - 1));
						}
						else {
							page.setZ(this.pages[this.pages.indexOf(page) - 1].getZ() + 0.1);
						}

						if (this.pages.indexOf(page) == 3 && this.pages[this.pages.length - 1].id < this.images.length - 1) {
							this.removedPage = this.pages.shift();
							for (var i = 0; i < this.pages.length; i++) {
								if (this.pages[i].isTurnedLeft) {
									this.pages[i].setZ(this.pages[i].getZ() - 0.1);
								}
								else {
									this.pages[i].setZ(this.pages[i].getZ() + 0.1);
								}
							}
							this.pages.push(new Page(this.pages[4].id + 1, this.images[this.pages[4].id + 1].front, this.images[this.pages[4].id + 1].back));
							this.pages[5].setRotation(Math.PI);
							this.pages[5].isTurnedLeft = false;
							this.pages[5].setZ(-0.5);
						}


						if (this.currentPage === page) this.currentPage = null;

						this.rightPage = this.pages[this.pages.indexOf(this.rightPage) + 1];
						this.leftPage = page;

					}
					else {
						page.rotation = Math.PI + (page.curlProgress + 300) * Math.PI / 300;
						page.offset = (0.2 - 0.1 * (page.curlProgress + 300) / 300 < 0.3) ? 0.2 - (0.1 * (page.curlProgress + 300) / 300) : 0.3;
						if (page.curlProgress > -450) {
							page.force = (1.7 + 0.6 * (page.curlProgress + 300) / 150);
						}
						else {
							page.force = (1.1 + 1.1 * (page.curlProgress + 450) / 150 > 0) ? 1.1 + 1.1 * (page.curlProgress + 450) / 150 : 0;
						}
						page.curlProgress -= 10;
					}
				}
			}
		}
		page.applyDeformation();
		updatePagesInfo();
	}

	this.flipPage = (direction, duration = 0.25) => {
		if (direction > 0) {
			this.flipToRight(duration);
		} else if (direction < 0) {
			this.flipToLeft(duration);
		}
	}

	this.flipToLeft = (duration = 1) => {
		if (book.currentPage) return;
		const windowWidth = window.innerWidth;
		const centerY = window.innerHeight / 2;
		const leftPage = this.leftPage
		if (!leftPage) return;
		book.selectPage(leftPage)
		book.currentPage.flipX = 0
		// Creating a tween for the flip animation
		const t = gsap.to(book.currentPage, {
			duration, // Duration of the animation in seconds
			ease: "Power2.easeOut", // Easing function
			onUpdate: function () {
				if (!book.currentPage) return;

				if (book.currentPage.curlProgress >= 500) {
					t.pause();
					book.currentPage.rotationCompleted = false;
				}
				book.leftPage.setDeformation(gsap.getProperty(book.currentPage, "flipX"), centerY, 0, 0);
			},
			onComplete: function () {
				book.currentPage.flipX = 0
			},
			flipX: 600 // Animate x from its current value to the width of the window
		});

	}

	this.flipToRight = (duration = 1) => {
		if (book.currentPage) return;
		const windowWidth = window.innerWidth;
		const centerY = window.innerHeight / 2;
		const rightPage = this.rightPage
		if (!rightPage) return;
		book.selectPage(rightPage)
		book.currentPage.flipX = windowWidth;
		// Creating a tween for the flip animation
		const t = gsap.to(book.currentPage, {
			duration, // Duration of the animation in seconds
			ease: "Power2.easeOut", // Easing function
			onUpdate: function () {
				if (!book.currentPage) return;
				if (book.currentPage.curlProgress <= - 500) {
					t.pause();
					book.currentPage.rotationCompleted = false;
					return;
				}
				book.currentPage.setDeformation(gsap.getProperty(book.currentPage, "flipX"), centerY, windowWidth, 0);
			},
			onComplete: function () {
				book.currentPage.flipX = windowWidth
			},
			flipX: windowWidth - 600 // Animate x from its current value to the width of the window
		});

	}
}
// end BOOK ==============================================

function updatePagesInfo() {
	var lp = book.rightPage ? book.rightPage.id : book.leftPage ? book.leftPage.id +0.5:  undefined;

	const page = (Number.isNaN(lp ) ? 0 : lp*2 );
	// var rp = (book.rightPage !== null && book.rightPage !== undefined) ? book.rightPage.id * 2 + 1 : 'none';
	setParam('page', page);
	document.getElementById('pageCount').innerText = `${page ?? 0} / ${book.numberOfPages}`
	// document.getElementById('pagesInfo').innerHTML='Pages: '+lp+' and '+rp+' of '+book.numberOfPages;
}



function zoom(event) {
	event.preventDefault();
	//event.stopPropagation();

	var wheelDelta = event.detail ? event.detail / -3 : event.wheelDelta / 120;
	fov -= wheelDelta;
	if (fov <= 1) fov = 1;
	if (fov >= 50) fov = 50;
	camera.projectionMatrix = THREE.Matrix4.makePerspective(fov, document.getElementById(webGlDiv).clientWidth / document.getElementById(webGlDiv).clientHeight, 1, 1000);
	if (fov >= 24) {
		removeParam('x')
		removeParam('y')
		removeParam('fx')
		removeParam('fy')
		camera.position.set(0, cameraY, 500);
		camera.lookAt(scene.position);
		//document.getElementById('info').style.color='black';
		//document.getElementById('info').innerHTML="Turn page by draging its edge. Use mouse wheel for zoom.";
		document.getElementById('infos').style.opacity = 1;
		document.getElementById('infos').style.pointerEvents = 'all';
	}
	else {
		document.getElementById('infos').style.pointerEvents = 'none';
		document.getElementById('infos').style.opacity = 0;
		//document.getElementById('info').style.color='red';
		//document.getElementById('info').innerHTML="Drag the book to move it on the screen. If you want to turn page, ZOOM OUT first.";
	}

	setParam('fov', fov);
}

function onMouseDown(event) {

	event.preventDefault();
	//event.stopPropagation();
	if (book.currentPage !== null) return;

	//document.querySelector("body").style.cursor = "none";

	if (fov < 24) {

	}
	else {
		// select page for rotation
		if ((event.clientX || event.targetTouches[0].clientX) < document.getElementById(webGlDiv).clientWidth / 2) {
			if (book.leftPage !== undefined && book.leftPage !== null) book.selectPage(book.leftPage);
		}
		else {
			if (book.rightPage !== null && book.rightPage !== undefined) book.selectPage(book.rightPage);
		}
	}

	document.getElementById(webGlDiv).addEventListener('mousemove', onMouseMove, false);
	document.getElementById(webGlDiv).addEventListener('touchmove', onMouseMove, false);
	document.getElementById(webGlDiv).addEventListener('mouseup', onMouseUp, false);
	document.getElementById(webGlDiv).addEventListener('touchend', onMouseUp, false);
	document.getElementById(webGlDiv).addEventListener('mouseout', onMouseOut, false);

	document.getElementById(webGlDiv).removeEventListener(mouseWheelEvent, zoom, false);

	mousePositionOnMouseDown.x = event.clientX || event.targetTouches[0].clientX;
	mousePositionOnMouseDown.y = event.clientY || event.targetTouches[0].clientY;
	lastMousePosition.x = event.clientX || event.targetTouches[0].clientX;
	lastMousePosition.y = event.clientY || event.targetTouches[0].clientY;
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}


function onMouseMove(event) {

	event.preventDefault();
	//event.stopPropagation();

	if (event.targetTouches) {
		mousePosition.x = event.targetTouches[0].clientX;
		mousePosition.y = event.targetTouches[0].clientY;
	} else {
		mousePosition.x = event.clientX
		mousePosition.y = event.clientY
	}
	if (fov < 24) {
		var xMove = lastMousePosition.x - mousePosition.x;
		var yMove = lastMousePosition.y - mousePosition.y;

		focusPoint.x = focusPoint.x + xMove;
		focusPoint.y = focusPoint.y - yMove;

		camera.position.x = camera.position.x + xMove / 5;
		camera.position.y = camera.position.y - yMove / 5;
		setParam('x', camera.position.x)
		setParam('y', camera.position.y)
		setParam('fx', focusPoint.x)
		setParam('fy', focusPoint.y)

	}
	else {
		if (book.currentPage !== null) {
			book.currentPage.setDeformation(mousePosition.x, mousePosition.y, mousePositionOnMouseDown.x, lastMousePosition.y);
		}
	}

	lastMousePosition.y = mousePosition.y;
	lastMousePosition.x = mousePosition.x;
}

function onMouseUp(event) {
	event.preventDefault();
	//event.stopPropagation();

	if (fov < 24) {

	}
	else {
		if (book.currentPage !== null) book.currentPage.rotationCompleted = false;
	}

	document.querySelector("body").style.cursor = "auto";
	document.getElementById(webGlDiv).removeEventListener('mousemove', onMouseMove, false);
	document.getElementById(webGlDiv).removeEventListener('mouseup', onMouseUp, false);
	document.getElementById(webGlDiv).removeEventListener('mouseout', onMouseOut, false);
	document.getElementById(webGlDiv).addEventListener(mouseWheelEvent, zoom, false);

}

function onMouseOut(event) {
	event.preventDefault();
	//event.stopPropagation();

	if (fov < 24) {
	}
	else {
		if (book.currentPage !== null) book.currentPage.rotationCompleted = false;
	}

	document.querySelector("body").style.cursor = "auto";
	document.getElementById(webGlDiv).removeEventListener('mousemove', onMouseMove, false);
	document.getElementById(webGlDiv).removeEventListener('mouseup', onMouseUp, false);
	document.getElementById(webGlDiv).removeEventListener('mouseout', onMouseOut, false);
	document.getElementById(webGlDiv).addEventListener(mouseWheelEvent, zoom, false);

}

function onWindowResize() {
	//setDivSize();
	camera.aspect = document.getElementById(webGlDiv).clientWidth / document.getElementById(webGlDiv).clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(document.getElementById(webGlDiv).clientWidth, document.getElementById(webGlDiv).clientHeight);
}

function animate() {
	requestAnimationFrame(animate);
	//stats.update();
	if (book.currentPage !== null) book.autoCompleteRotation(book.currentPage);
	if (book.removedPage !== null) {
		scene.remove(book.removedPage.fakePage);
		book.removedPage = null;
		for (var i = 0; i < book.pages.length; i++) {
			scene.add(book.pages[i].fakePage);
		}
	}
	render();

}

function render() {
	for (var i = 0; i < book.pages.length; i++) {
		book.pages[i].mod.apply();
	}
	renderer.render(scene, camera);
}

function jump(number) {


	for (var i = 0; i < book.pages.length; i++) {
		scene.remove(book.pages[i].fakePage);
	}

	book.jumpToPage(number)
	if(book.leftPage)
	book.leftPage.applyDeformation();
	if(book.rightPage)
	book.rightPage.applyDeformation();

	for (var i = 0; i < book.pages.length; i++) {
		scene.add(book.pages[i].fakePage);
	}
	updatePagesInfo()
}


function setDivSize() {
	document.getElementById(webGlDiv).style.height = (window.innerHeight - 53) + 'px';
	document.getElementById(webGlDiv).style.width = window.innerWidth + 'px';
}

function setParam(param, value) {
	const currentUrl = new URL(window.location.href);
	const searchParams = currentUrl.searchParams;
	searchParams.set(param, Number.isNaN(value) ? value : Math.round(Number(value)));
	window.history.replaceState({}, '', currentUrl.toString());
}

function removeParam(param) {
	const currentUrl = new URL(window.location.href);
	const searchParams = currentUrl.searchParams;
	searchParams.delete(param);
	window.history.replaceState({}, '', currentUrl.toString());
}