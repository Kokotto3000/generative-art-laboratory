//déclarons à notre éditeur de texte que c'est un projet "canvas" pour déclencher "l'écriture intuitive" sur les contextes
/** @type {HTMLCanvasElement} */

//récupération des éléments du DOM
const CANVAS= document.getElementById('canvas-1');
const CTX= CANVAS.getContext('2d');
//définition de la taille du canvas
CANVAS.width= window.innerWidth;
CANVAS.height= window.innerHeight;

//jouer avec le global composite et l'épaisseur des lignes...
CTX.lineWidth= 0.2;
CTX.globalCompositeOperation= 'lighten';

let drawing= false;

//nous allons animer des éléments qui partiront d'une racine
class Root {
    //le constructeur prend x et y en arguments, coordonnées de la "root"
    constructor(x, y){
        this.x= x;
        this.y= y;
        //les éléments partiront dans des directions différentes à des vitesses différentes, la valeur sera comprise entre -2 et 2
        this.speedX= Math.random() * 4 - 2;
        this.speedY= Math.random() * 4 - 2;
        //définition du rayon max sur lesquels vont bouger les éléments
        this.maxSize= Math.random() * 7 + 5;
        //taille de départ
        this.size= Math.random() * 1 + 2;
        //pour faire varier la vitesse à laquelle les éléments grandissent
        this.velocitySize= Math.random() * 0.2 + 0.05;
        //pour que les éléments ne suivent pas une ligne droite
        this.angleX= Math.random() * 6.2; //à peu près un cercle en radiant
        //faisons aussi varier l'angle
        this.velocityAngleX= Math.random() * 0.6 - 0.3;
        this.angleY= Math.random() * 6.2;
        this.velocityAngleY= Math.random() * 0.6 - 0.3;
        //pour faire varier la couleur
        this.lightness= 10;
    }

    //chaque animationFrame va appeler la methode update qui va faire bouger et changer les éléments
    update(){
        //directions
        this.x += this.speedX + Math.sin(this.angleX);
        this.y += this.speedY + Math.sin(this.angleY);
        //taille de l'élément qui grandit à chaque animationFrame
        this.size += this.velocitySize;
        this.angleX += this.velocityAngleX;
        this.angleY += this.velocityAngleY;
        if(this.lightness < 70) this.lightness += 0.25;
        if(this.size < this.maxSize){
            //on dessine l'élément
            CTX.beginPath();
            //ici un cercle
            CTX.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            //le remplissage de la couleur sera dynamique, par défaut tout est noir
            CTX.fillStyle= "hsl(140, 100%, " + this.lightness + "%)";
            CTX.fill();
            CTX.stroke();
            //recursive sur update avec requestAnimationFrame, pour que this.x et this.y soient bien liés à cette méthode, on utilise bind (sinon erreur this.x is undefined...)
            requestAnimationFrame(this.update.bind(this));
        }else{
            const FLOWER= new Flower(this.x, this.y, this.size);
            FLOWER.grow();

        }
    }
}

//maintenant nous allons animer des fleurs
class Flower {
    constructor(x, y, size){
        this.x= x;
        this.y= y;
        this.size= size;
        this.velocitySize= Math.random() * 0.3 + 0.2;
        this.maxFlowerSize= this.size + Math.random() * 100;
        this.image= new Image();
        this.image.src= '../img/flowers.png';
        this.frameSize= 100;
        //position de la fleur dans la spritesheet
        this.frameX= Math.floor(Math.random() * 3);
        this.frameY= Math.floor(Math.random() * 3);
        this.size > 11.5 ? this.willFlower= true : this.willFlower= false;
        //pour faire tourner les fleurs
        this.angle= 0;
        this.velocityAngle= Math.random() * 0.05 - 0.025;
    }
    grow() {
        if(this.size < this.maxFlowerSize && this.willFlower){
            this.size += this.velocitySize;
            this.angle += this.velocityAngle;
            //avant d'initier la rotation, il faut encadrer ce qui concerne ces éléments à faire tourner entre save et restore
            CTX.save();
            CTX.translate(this.x, this.y); //donne le centre de la rotation
            CTX.rotate(this.angle);
            //this.size pour choisir la taille de l'image, sx, sy... pour choisir l'image dans la spritesheet, pour la rotation on change this.x et this.y part 0 (à cause de translate)
            CTX.drawImage(this.image, this.frameSize * this.frameX, this.frameSize * this.frameY, this.frameSize, this.frameSize, 0 - this.size/2, 0 - this.size/2, this.size, this.size);
            requestAnimationFrame(this.grow.bind(this));
            CTX.restore();
        }
        
    }
}

//création de l'évènement qui va détecter les mouvements de la souris
window.addEventListener('mousemove', e => {
    //console.log(e);
    //pour ne dessiner que quand on appuie sur la souris
    if(drawing){
        //pour créer plus de "root" à chaque mouvement
        for(let i= 0; i < 3; i++){
            //à chaque mouvement on crée une nouvelle "root" et on lui passe les coordonnées de la souris
            const ROOT= new Root(e.x, e.y);
            ROOT.update();
        }
    }
});

//event pour détecter quand le bouton de la souris est pressé ou pas (on ajoute e à l'event pour l'explosion)
window.addEventListener('mousedown', (e)=> {
    drawing= true;
    //pour créer plutôt un effet d'explosion au click
    /*for(let i= 0; i < 30; i++){
        const ROOT= new Root(e.x, e.y);
        ROOT.update();
    }*/
});
window.addEventListener('mouseup', ()=> {
    drawing= false;
});

