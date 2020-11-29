import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css']
})
export class RenderComponent implements OnInit {

  toggled:boolean = false;
  scene = new THREE.Scene();
  stateOptions:any[];
  
  renderer = new THREE.WebGLRenderer();
  camera:any;
  value1: string = "off";
  myfile: any[] = [];
  public loader = new GLTFLoader();
  cube:any=null;
  // public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
  controls:any = null;
  mesh:any = null;
  light:any = null;
  boxmesh:any = null;


  constructor() { 
    this.stateOptions = [
      { label: "Dark", value: "off" },
      { label: "Light", value: "on" }
    ];
    
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    this.controls = new OrbitControls(this.camera,this.renderer.domElement);   
  }

  ngOnInit(): void {
    this.createCanvas();
    //this.configCamera()

  }

  ngAfterViewInit(){
    this.configControls();
    this.createMesh();
    this.createLight(); // esse metodo esta fazendo um pointLight igual o createPointLight , porem com menos parametros, analisar o que é cada parametro passado. 
  }

  

  public createCanvas(){

    
    //var renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth-100, window.innerHeight-100 );
    document.body.appendChild( this.renderer.domElement );
    

    this.camera.position.z = 5;
    
    var animate = () =>{
        requestAnimationFrame( animate );
    
        //this.cube.rotation.x += 0.01;
        //this.cube.rotation.y += 0.01;
    
        this.renderer.render( this.scene, this.camera );
    };
    animate();


    document.body.getElementsByTagName('canvas')[0].style.margin = "auto";
    document.body.getElementsByTagName('canvas')[0].style.padding = "0";



    this.createGrid();
    this.render();
  }

  createGrid(){
    const gridHelper = new THREE.GridHelper( 10, 10 );
    gridHelper.position.y = -1;
    this.scene.add( gridHelper );
  }

  animate(cube:any){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    this.render()
  }

  public toggleBackground(){
    var color;
    (this.value1==='off')? color = new THREE.Color(0x000000):
                        color = new THREE.Color(0xffffff);
    this.scene.background = color;
    // this.renderer.render(this.scene,this.camera);
    this.render();
  }


  configControls() {
    //this.controls.autoRotate = true;
    this.controls.enableZoom = false;
    this.controls.enablePan  = false;
    this.controls.update();
  }
  
  createMesh(): void {
    var geometry = new THREE.BoxGeometry();
    var material = this.createWoodBoxMaterial() // metodo que carrega a textura e retorna para ser adicionada
    this.boxmesh = new THREE.Mesh(geometry, material);
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );
    this.scene.add( this.boxmesh ); //textura aplicada na cena
    this.scene.add(this.createDirectionalLight()); //iluminação direciona
    this.scene.add(this.createAmbientLight()); //sem essa iluminação, as faces que nao estao apontadas para o espectador (nós) ficam totalmente pretas. Com a iluminação ambiente elas ficam levemente sombreada. 
    this.scene.add(this.createPointLight()); //iluminação pontual 
  }

  createLight(): void {
    this.light = new THREE.PointLight( 0xffffff );
	  this.light.position.set( -10, 10, 10 );
	  this.scene.add( this.light );
  }

  configCamera(): void {
    this.camera.aspect = this.calculateAspectRatio();
    this.camera.updateProjectionMatrix();
	  this.camera.position.set( -15, 10, 15 );
	  this.camera.lookAt( this.scene.position );
  }

  private calculateAspectRatio(): number {
    
    const height = window.innerHeight;
    if (height === 0) {
      return 0;
    }
    return window.innerWidth / window.innerHeight;
  }

  createWoodBoxMaterial = function() {
    const loader = new THREE.TextureLoader();
    //obs: sem efeito de iluminação,ou seja, a imagem está totalmente visivel em todas as faces, utilizar MeshBasicMaterial no lugar de MeshPhongMaterial

    //Exemplo de mesma imagem para todas faces do cubo
    /*const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg')
    });*/

    //exemplo com uma imagem diferente para cada face do cubo
    const boxMaterial = [
      new THREE.MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg')}),
      new THREE.MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg')}),
    ];

    return boxMaterial;

  };

  createDirectionalLight = function() {
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10,100,120);
    directionalLight.name='directional';
    return directionalLight
  };

  createAmbientLight = function() {
    var ambientLight = new THREE.AmbientLight(0x111111);
    ambientLight.name='ambient';
    return ambientLight;
  };

  createPointLight = function(){
    const light = new THREE.PointLight( 0xfffff, 1, 100 );
    light.position.set( 50, 50, 50 );
    return light
  }



  public render(){
    this.renderer.render( this.scene, this.camera );
  }

}
