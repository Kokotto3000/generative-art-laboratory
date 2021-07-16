//déclarons à notre éditeur de texte que c'est un projet "canvas" pour déclencher "l'écriture intuitive" sur les contextes
/** @type {HTMLCanvasElement} */

//récupération des éléments du DOM
const CANVAS= document.getElementById('canvas-1');
const CTX= CANVAS.getContext('2d');
//définition de la taille du canvas
CANVAS.width= window.innerWidth;
CANVAS.height= window.innerHeight;

CTX.fillStyle= '#FFF5DE';
CTX.strokeStyle= '#3c5186';

//jouer avec le global composite et l'épaisseur des lignes...
//CTX.lineWidth= 0.2;
//CTX.globalCompositeOperation= 'lighten';

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
        this.maxSize= Math.random() * 7 + 20;
        //taille de départ
        this.size= Math.random() * 1 + 2;
        //pour faire varier la vitesse à laquelle les éléments grandissent
        this.velocitySize= Math.random() * 0.2 + 0.5;
        //pour que les éléments ne suivent pas une ligne droite
        this.angleX= Math.random() * 6.2; //à peu près un cercle en radiant
        //faisons aussi varier l'angle
        this.velocityAngleX= Math.random() * 0.6 - 0.3;
        this.angleY= Math.random() * 6.2;
        this.velocityAngleY= Math.random() * 0.6 - 0.3;
        //pour faire varier la couleur
        this.lightness= 10;
        this.angle= 0;
        this.velocityAngle= Math.random() * 0.02 + 0.05;
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
        this.angle += this.velocityAngle;
        if(this.lightness < 70) this.lightness += 0.25;
        if(this.size < this.maxSize){
            CTX.save();
            CTX.translate(this.x, this.y);
            CTX.rotate(this.angle);
            //si on laisse this.x et this.y à la place de 0, 0 ça donne aussi des effets rigolos, si on ne fill pas, donne un bel effet de transparence
            CTX.fillRect(0, 0, this.size, this.size);
            CTX.strokeRect(0, 0, this.size, this.size);
            CTX.restore();
            requestAnimationFrame(this.update.bind(this));
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

//penser à ajouter un event resize !!!
//de quoi enregistrer les photos en png...