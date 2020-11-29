import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
  controls:any = null;
  mesh:any = null;
  light:any = null;
  boxmesh:any = null;
  geometry = new THREE.BoxGeometry();
  
  checkWall:boolean = false;
  checkWallMap:boolean = false;
  nocheck:boolean = true;

  checkPhong:boolean = true;
  checkGouraud:boolean = false;

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
    this.createPhongLightning();
    //this.configCamera()
  }

  ngAfterViewInit(){
    this.configControls();
    this.createMesh('idNoTexture');
    this.createLight(); // esse metodo esta fazendo um pointLight igual o createPointLight , porem com menos parametros, analisar o que é cada parametro passado. 
  }
  

  public createCanvas(){
    this.renderer.setSize( window.innerWidth-100, window.innerHeight-100 );
    document.body.appendChild( this.renderer.domElement );
    
    this.camera.position.z = 5;
    
    var animate = () =>{
        requestAnimationFrame( animate );
        this.renderer.render( this.scene, this.camera );
    };
    animate();

    // Gambiarra no Canvas
    document.body.getElementsByTagName('canvas')[0].style.margin = "auto";
    document.body.getElementsByTagName('canvas')[0].style.padding = "0";
    document.body.getElementsByTagName('canvas')[0].style.borderStyle = "solid";
    document.body.getElementsByTagName('canvas')[0].style.borderColor = "#2196f3";

    this.createGrid();
    this.render();
  }


  async changeStatusLighting(a:string,e:Event){

    if(a==="idPhong" && !this.checkPhong){
      this.checkPhong = true;
      this.checkGouraud = false;
    }else if(a==="idGouraud" && !this.checkGouraud){
      this.checkPhong = false;
      this.checkGouraud = true;
    }

  }

  async changeStatus(a:string,e:Event){

    if(a==='idWall'){
      this.checkWall = !this.checkWall;
      this.checkWallMap = false;
      this.nocheck = false;
    }else if(a==='idWallMap'){
      this.checkWallMap = !this.checkWallMap;
      this.checkWall = false;
      this.nocheck = false;
    }else{
      this.nocheck = !this.nocheck;
      this.checkWall = false;
      this.checkWallMap = false;
    }

    this.createMesh(a);

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
  
  createMesh(typeItem:string): void {
    
    var material; // metodo que carrega a textura e retorna para ser adicionada
    
    if(typeItem==='idWall'){
      material = this.createWallBoxMaterial()
    }else if(typeItem==='idWallMap'){
      material = this.createWallTextureAndMapBoxMaterial();
    } else {
      material = this.createNoTextureBoxMaterial();
    }
    // var geometry = new THREE.BoxGeometry();
    this.cube = new THREE.Mesh( this.geometry, material );
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


  createWallBoxMaterial():any{
    const loader = new THREE.TextureLoader();
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/14354e63-49e5-4ff6-a0aa-88619b1ca5e3/d90plia-a48d5b3e-ae2d-4a48-b2ea-d1b147f77945.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTQzNTRlNjMtNDllNS00ZmY2LWEwYWEtODg2MTliMWNhNWUzXC9kOTBwbGlhLWE0OGQ1YjNlLWFlMmQtNGE0OC1iMmVhLWQxYjE0N2Y3Nzk0NS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.m0gxMdtjzAdV1gQJKRAOSylqf6p2Ii7ZsrOw_AzKm3M')
    });
    boxMaterial.normalMap = null;
    return boxMaterial;
  }


  createWallTextureAndMapBoxMaterial():any{
    const loader = new THREE.TextureLoader();
    
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/14354e63-49e5-4ff6-a0aa-88619b1ca5e3/d90plia-a48d5b3e-ae2d-4a48-b2ea-d1b147f77945.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTQzNTRlNjMtNDllNS00ZmY2LWEwYWEtODg2MTliMWNhNWUzXC9kOTBwbGlhLWE0OGQ1YjNlLWFlMmQtNGE0OC1iMmVhLWQxYjE0N2Y3Nzk0NS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.m0gxMdtjzAdV1gQJKRAOSylqf6p2Ii7ZsrOw_AzKm3M')
    });
    var normalMap = new THREE.TextureLoader().load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/14354e63-49e5-4ff6-a0aa-88619b1ca5e3/d90plz3-5fa8674f-73b4-47b9-8a02-26a87d3d0c26.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTQzNTRlNjMtNDllNS00ZmY2LWEwYWEtODg2MTliMWNhNWUzXC9kOTBwbHozLTVmYTg2NzRmLTczYjQtNDdiOS04YTAyLTI2YTg3ZDNkMGMyNi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.ydTIGrQHFicUICxKLys73hXlxYF0Y8y2BNCXWbddW2s");

    boxMaterial.normalMap = normalMap;
    boxMaterial.normalScale.set(1, 1.2);
    
    return boxMaterial;
  }
  
  createNoTextureBoxMaterial():any{
    const loader = new THREE.TextureLoader();
    const boxMaterial = new THREE.MeshPhongMaterial({ 
      map: loader.load('https://i0.wp.com/www.multarte.com.br/wp-content/uploads/2018/12/fundo-branco-liso2-1024x1024.jpg?resize=696%2C696&ssl=1')
    });
    return boxMaterial;
  }

  /*=================================================================================================
                                    Iluminação de Phong
  ================================================================================================*/
  public createPhongLightning(){
    this.scene.add(this.createDirectionalLight()); //iluminação direciona
    this.scene.add(this.createAmbientLight()); //sem essa iluminação, as faces que nao estao apontadas para o espectador (nós) ficam totalmente pretas. Com a iluminação ambiente elas ficam levemente sombreada. 
    this.scene.add(this.createPointLight()); //iluminação pontual 
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

  /*=================================================================================================
                                    Iluminação de Gouraud
  ================================================================================================*/



  /**
   * Metodo para renderizar a cena a cada modificações de objetos
  */
  public render(){
    this.renderer.render( this.scene, this.camera );
  }

}
