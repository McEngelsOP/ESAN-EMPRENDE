// Datos de ejemplo de la demo anterior.
const EXAMPLE_PRODUCTS = [
  {
    "id": "cookies",
    "name": "Cookies de chocolate",
    "store": "Miga & Mood",
    "owner": "Valeria",
    "category": "Comida y bebidas",
    "price": 12,
    "image": "/images/cookies.jpg",
    "description": "Crujientes por fuera, suaves por dentro. Cookies artesanales con trozos de chocolate. Pack de 3 unidades, preparadas a pedido. Coordina la entrega en el campus con el emprendimiento.",
    "available": true
  },
  {
    "id": "bag",
    "name": "Mochila para todos tus planes",
    "store": "Entre Clases",
    "owner": "Diego",
    "category": "Moda y accesorios",
    "price": 89,
    "image": "/images/bag.jpg",
    "description": "Una mochila versátil para llevar tus apuntes y acompañarte después de clases. Consulta los colores disponibles y coordina la entrega.",
    "available": true
  },
  {
    "id": "plant",
    "name": "Un poquito de verde",
    "store": "Raíz",
    "owner": "Lucía",
    "category": "Hogar y bienestar",
    "price": 28,
    "image": "/images/plant.jpg",
    "description": "Una planta pequeña para darle vida a tu escritorio. Incluye maceta y una guía de cuidados. Consulta las variedades disponibles.",
    "available": true
  },
  {
    "id": "jewelry",
    "name": "Detalles que te acompañan",
    "store": "Áurea Studio",
    "owner": "Camila",
    "category": "Moda y accesorios",
    "price": 35,
    "image": "/images/jewelry.jpg",
    "description": "Accesorios para darle un detalle especial a tus días. Pregunta por los modelos, materiales y cuidados antes de elegir el tuyo.",
    "available": true
  },
  {
    "id": "coffee",
    "name": "Café para una buena pausa",
    "store": "Pausa Café",
    "owner": "Mateo",
    "category": "Comida y bebidas",
    "price": 32,
    "image": "/images/coffee.jpg",
    "description": "Café tostado en presentación de 250 g. Consulta las opciones de molienda para tu método favorito y coordina tu entrega.",
    "available": true
  },
  {
    "id": "notebook",
    "name": "Aquí empiezan tus ideas",
    "store": "Papel & Punto",
    "owner": "Andrea",
    "category": "Arte y papelería",
    "price": 24,
    "image": "/images/notebook.jpg",
    "description": "Libreta para apuntes, proyectos y todas esas ideas que aparecen entre clases. Consulta los diseños y tipos de papel disponibles.",
    "available": true
  },
  {
    "id": "brownies",
    "name": "Brownies para compartir",
    "store": "Miga & Mood",
    "owner": "Valeria",
    "category": "Comida y bebidas",
    "price": 20,
    "image": "/images/cookies.jpg",
    "description": "Una propuesta de repostería de Miga & Mood. Caja de brownies por encargo; consulta porciones, ingredientes y disponibilidad. Imagen de referencia del emprendimiento.",
    "available": true
  },
  {
    "id": "tote",
    "name": "Merch para tu grupo",
    "store": "Entre Clases",
    "owner": "Diego",
    "category": "Moda y accesorios",
    "price": 45,
    "image": "/images/bag.jpg",
    "description": "Diseño de merchandising para tu grupo o proyecto. Coordina modelos, cantidades y personalización. Imagen de referencia del emprendimiento.",
    "available": true
  },
  {
    "id": "web",
    "name": "Tu primera página web",
    "store": "Nodo Studio",
    "owner": "Sebastián",
    "category": "Soluciones tech",
    "price": 250,
    "image": "tech",
    "kind": "Servicio",
    "description": "Landing pages para presentar tu emprendimiento. El alcance, los tiempos y el precio final se coordinan directamente con el creador.",
    "available": true
  },
  {
    "id": "automation",
    "name": "Automatiza esas tareas",
    "store": "Nodo Studio",
    "owner": "Sebastián",
    "category": "Soluciones tech",
    "price": 0,
    "image": "tech",
    "kind": "Servicio",
    "description": "Cuéntanos qué tarea repites y exploremos una solución. Cotización según el alcance y las herramientas necesarias.",
    "available": true
  },
  {
    "id": "idea",
    "name": "Una segunda vida a tus apuntes",
    "store": "Circular Campus",
    "owner": "Mariana",
    "category": "Soluciones tech",
    "price": 0,
    "image": "idea",
    "kind": "Idea",
    "description": "Idea de una plataforma para intercambiar materiales de estudio propios. Buscamos estudiantes que quieran colaborar en diseño, desarrollo y validación.",
    "available": true
  },
  {
    "id": "design",
    "name": "Identidad para tu emprendimiento",
    "store": "Papel & Punto",
    "owner": "Andrea",
    "category": "Servicios",
    "price": 80,
    "image": "/images/notebook.jpg",
    "kind": "Servicio",
    "description": "Diseño de una identidad visual inicial para pequeños negocios. Consulta entregables y revisiones. Imagen de referencia del emprendimiento.",
    "available": true
  }
];
