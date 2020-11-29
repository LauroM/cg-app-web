import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';


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

  checkWall:boolean = false;
  checkWood:boolean = false;
  checkFlower:boolean = true;
  checkNoTexture:boolean = false;

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
    this.scene.add(this.createDirectionalLight()); //iluminação direciona
    this.scene.add(this.createAmbientLight()); //sem essa iluminação, as faces que nao estao apontadas para o espectador (nós) ficam totalmente pretas. Com a iluminação ambiente elas ficam levemente sombreada. 
    this.scene.add(this.createPointLight()); //iluminação pontual 
  }

  ngAfterViewInit(){
    this.configControls();
    this.createMesh('idFlower');
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

  changeStatus(a:string,e:Event){

    this.createMesh(a);
    if( a==='idWall'){
      this.checkWall= true;
      this.checkWood = false;
      this.checkFlower = false;
      this.checkNoTexture = false;
    }else if(a==='idWood'){
      this.checkWall= false;
      this.checkWood = true;
      this.checkFlower = false;
      this.checkNoTexture = false;
    }else if(a==='idFlower'){
    this.checkWall= false;
    this.checkWood = false;
    this.checkFlower = true;
    this.checkNoTexture = false;
    } else {
      this.checkWall= false;
      this.checkWood = false;
      this.checkFlower = false;
      this.checkNoTexture = true;
    }

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
  
  createMesh(typeMesh:string): void {
    var geometry = new THREE.BoxGeometry();

    var material;// = this.createWoodBoxMaterial() // metodo que carrega a textura e retorna para ser adicionada
    if(typeMesh==='idWall'){
      material = this.createWallBoxMaterial() // metodo que carrega a textura e retorna para ser adicionada
    }else if(typeMesh==='idWood'){
      material = this.createWoodBoxMaterial()
    }else if(typeMesh==='idFlower'){
      material = this.createFlowerBoxMaterial();
    }else{
      material = this.createNoTextureBoxMaterial();
    }
    
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );
    this.render();
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

  createFlowerBoxMaterial = function() {
    const loader = new THREE.TextureLoader();
    //obs: sem efeito de iluminação,ou seja, a imagem está totalmente visivel em todas as faces, utilizar MeshBasicMaterial no lugar de MeshPhongMaterial

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


  createWallBoxMaterial():any{
    const loader = new THREE.TextureLoader();
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg')
    });
    return boxMaterial;
  }


  createWoodBoxMaterial():any{
    const loader = new THREE.TextureLoader();
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('data:image/jpeg;base64,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')
    });
    return boxMaterial;
  }
  
  createNoTextureBoxMaterial():any{
    const loader = new THREE.TextureLoader();
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('https://i0.wp.com/www.multarte.com.br/wp-content/uploads/2018/12/fundo-branco-liso2-1024x1024.jpg?resize=696%2C696&ssl=1')
    });
    return boxMaterial;
  }

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
