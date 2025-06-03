export interface Product {
  id: string
  name: string
  description: string
  price: number
  priceUnit: "hour" | "day"
  category: string
  image: string
  owner: string
  university: string
  available: boolean
  pickupAddress: string
  returnAddress: string
  paymentMethod: "efectivo"
  createdAt: Date
  ownerId?: string
}

export interface RentalDetails {
  id: string
  productId: string
  productName: string
  hours: number
  totalPrice: number
  pickupDate: string
  pickupTime: string
  pickupAddress: string
  returnAddress: string
  rentalDate: Date
  status: "active" | "completed"
}

export const mockProducts: Product[] = [
  // Electrónicos
  {
    id: "1",
    name: "Cámara Canon EOS R6",
    description:
      "Cámara profesional perfecta para proyectos de fotografía y video. Incluye lente 24-70mm. Pago únicamente en efectivo.",
    price: 45,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "María González",
    university: "UNSA",
    available: true,
    pickupAddress: "Campus UNSA, Facultad de Ingeniería, Aula 205",
    returnAddress: "Campus UNSA, Facultad de Ingeniería, Aula 205",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Proyector Epson",
    description:
      "Proyector HD para presentaciones y eventos. Incluye cables y control remoto. Pago únicamente en efectivo.",
    price: 25,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Ana López",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Biblioteca Central, Piso 2",
    returnAddress: "UCSP, Biblioteca Central, Piso 2",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Drone DJI Mini 3",
    description:
      "Drone compacto con cámara 4K, perfecto para grabaciones aéreas y fotografía. Pago únicamente en efectivo.",
    price: 60,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Sofia Herrera",
    university: "UCSM",
    available: true,
    pickupAddress: "UCSM, Cafetería Principal, Mesa 12",
    returnAddress: "UCSM, Cafetería Principal, Mesa 12",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    name: "Laptop Gaming ASUS ROG",
    description:
      "Laptop de alto rendimiento para gaming, diseño y programación. 16GB RAM, RTX 3060. Pago únicamente en efectivo.",
    price: 35,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Carlos Mendoza",
    university: "UTP",
    available: true,
    pickupAddress: "UTP, Laboratorio de Cómputo 3, Edificio A",
    returnAddress: "UTP, Laboratorio de Cómputo 3, Edificio A",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    name: "Cámara GoPro Hero 11",
    description:
      "Cámara de acción resistente al agua, perfecta para deportes extremos y aventuras. Pago únicamente en efectivo.",
    price: 30,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Luis Ramírez",
    university: "UNSA",
    available: true,
    pickupAddress: "UNSA, Gimnasio Universitario, Entrada Principal",
    returnAddress: "UNSA, Gimnasio Universitario, Entrada Principal",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    name: "Micrófono Blue Yeti",
    description:
      "Micrófono profesional USB para podcasts, streaming y grabaciones de audio. Pago únicamente en efectivo.",
    price: 20,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Andrea Silva",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Estudio de Grabación, Edificio de Comunicaciones",
    returnAddress: "UCSP, Estudio de Grabación, Edificio de Comunicaciones",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "7",
    name: "Tablet iPad Pro",
    description:
      "iPad Pro 12.9 pulgadas con Apple Pencil incluido, ideal para diseño y presentaciones. Pago únicamente en efectivo.",
    price: 40,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Roberto Flores",
    university: "UCSM",
    available: true,
    pickupAddress: "UCSM, Facultad de Arquitectura, Sala de Diseño",
    returnAddress: "UCSM, Facultad de Arquitectura, Sala de Diseño",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-15"),
  },
  {
    id: "8",
    name: "Consola PlayStation 5",
    description:
      "Consola de videojuegos de última generación con 2 controles y juegos populares. Pago únicamente en efectivo.",
    price: 25,
    priceUnit: "hour",
    category: "Electrónicos",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Diego Torres",
    university: "UTP",
    available: true,
    pickupAddress: "UTP, Centro de Estudiantes, Sala de Recreación",
    returnAddress: "UTP, Centro de Estudiantes, Sala de Recreación",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-20"),
  },

  // Deportes
  {
    id: "9",
    name: "Bicicleta de Montaña Trek",
    description:
      "Bicicleta de montaña en excelente estado, perfecta para aventuras y ejercicio. Pago únicamente en efectivo.",
    price: 15,
    priceUnit: "hour",
    category: "Deportes",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Carlos Ruiz",
    university: "UNSA",
    available: true,
    pickupAddress: "UNSA, Estacionamiento Principal, Zona de Bicicletas",
    returnAddress: "UNSA, Estacionamiento Principal, Zona de Bicicletas",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "10",
    name: "Tabla de Surf",
    description: "Tabla de surf para principiantes e intermedios. Incluye leash y cera. Pago únicamente en efectivo.",
    price: 20,
    priceUnit: "hour",
    category: "Deportes",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Andrés Castro",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Piscina Universitaria, Vestuarios",
    returnAddress: "UCSP, Piscina Universitaria, Vestuarios",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "11",
    name: "Equipo de Camping Completo",
    description:
      "Carpa para 4 personas, sleeping bags, cocina portátil y accesorios de camping. Pago únicamente en efectivo.",
    price: 25,
    priceUnit: "hour",
    category: "Deportes",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Patricia Vega",
    university: "UCSM",
    available: true,
    pickupAddress: "UCSM, Almacén de Deportes, Edificio Principal",
    returnAddress: "UCSM, Almacén de Deportes, Edificio Principal",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-28"),
  },
  {
    id: "12",
    name: "Kayak Individual",
    description:
      "Kayak de una persona con remo incluido, perfecto para aventuras acuáticas. Pago únicamente en efectivo.",
    price: 18,
    priceUnit: "hour",
    category: "Deportes",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Miguel Quispe",
    university: "UTP",
    available: true,
    pickupAddress: "UTP, Club Náutico Universitario, Muelle Principal",
    returnAddress: "UTP, Club Náutico Universitario, Muelle Principal",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-03"),
  },
  {
    id: "13",
    name: "Set de Pesas y Mancuernas",
    description:
      "Equipo completo de ejercicio con pesas ajustables y mancuernas de diferentes pesos. Pago únicamente en efectivo.",
    price: 12,
    priceUnit: "hour",
    category: "Deportes",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Fernanda Morales",
    university: "UNSA",
    available: true,
    pickupAddress: "UNSA, Gimnasio Universitario, Recepción",
    returnAddress: "UNSA, Gimnasio Universitario, Recepción",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-08"),
  },
  {
    id: "14",
    name: "Bicicleta Eléctrica",
    description:
      "Bicicleta eléctrica con autonomía de 50km, perfecta para movilidad urbana. Pago únicamente en efectivo.",
    price: 30,
    priceUnit: "hour",
    category: "Deportes",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Javier Huamán",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Portería Principal, Caseta de Seguridad",
    returnAddress: "UCSP, Portería Principal, Caseta de Seguridad",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-12"),
  },

  // Música
  {
    id: "15",
    name: "Guitarra Acústica Yamaha",
    description:
      "Guitarra acústica en perfecto estado, ideal para presentaciones y práctica. Pago únicamente en efectivo.",
    price: 15,
    priceUnit: "hour",
    category: "Música",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Diego Morales",
    university: "UCSM",
    available: true,
    pickupAddress: "UCSM, Aula de Música, Conservatorio",
    returnAddress: "UCSM, Aula de Música, Conservatorio",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-01-30"),
  },
  {
    id: "16",
    name: "Piano Eléctrico Casio",
    description:
      "Piano eléctrico de 88 teclas con múltiples sonidos y ritmos incorporados. Pago únicamente en efectivo.",
    price: 25,
    priceUnit: "hour",
    category: "Música",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Isabella Chávez",
    university: "UTP",
    available: true,
    pickupAddress: "UTP, Sala de Música, Edificio Cultural",
    returnAddress: "UTP, Sala de Música, Edificio Cultural",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-04"),
  },
  {
    id: "17",
    name: "Batería Acústica Pearl",
    description: "Batería completa de 5 piezas con platillos y baquetas incluidas. Pago únicamente en efectivo.",
    price: 30,
    priceUnit: "hour",
    category: "Música",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Sebastián Rojas",
    university: "UNSA",
    available: true,
    pickupAddress: "UNSA, Estudio de Música, Sótano del Auditorio",
    returnAddress: "UNSA, Estudio de Música, Sótano del Auditorio",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-09"),
  },
  {
    id: "18",
    name: "Violín 4/4 Profesional",
    description: "Violín de tamaño completo con estuche, arco y resina incluidos. Pago únicamente en efectivo.",
    price: 20,
    priceUnit: "hour",
    category: "Música",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Camila Vargas",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Conservatorio de Música, Sala de Ensayo 3",
    returnAddress: "UCSP, Conservatorio de Música, Sala de Ensayo 3",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-14"),
  },
  {
    id: "19",
    name: "Amplificador Marshall",
    description:
      "Amplificador de guitarra de 50W, perfecto para ensayos y presentaciones. Pago únicamente en efectivo.",
    price: 18,
    priceUnit: "hour",
    category: "Música",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Rodrigo Paz",
    university: "UCSM",
    available: true,
    pickupAddress: "UCSM, Sala de Ensayo, Centro Cultural",
    returnAddress: "UCSM, Sala de Ensayo, Centro Cultural",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-18"),
  },

  // Herramientas
  {
    id: "20",
    name: "Taladro Inalámbrico Bosch",
    description:
      "Taladro profesional con batería de larga duración y set de brocas incluido. Pago únicamente en efectivo.",
    price: 22,
    priceUnit: "hour",
    category: "Herramientas",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Fernando López",
    university: "UTP",
    available: true,
    pickupAddress: "UTP, Taller de Ingeniería, Edificio de Talleres",
    returnAddress: "UTP, Taller de Ingeniería, Edificio de Talleres",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-06"),
  },
  {
    id: "21",
    name: "Sierra Circular",
    description:
      "Sierra circular eléctrica para cortes precisos en madera y otros materiales. Pago únicamente en efectivo.",
    price: 28,
    priceUnit: "hour",
    category: "Herramientas",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Marcos Delgado",
    university: "UNSA",
    available: true,
    pickupAddress: "UNSA, Taller de Carpintería, Facultad de Ingeniería",
    returnAddress: "UNSA, Taller de Carpintería, Facultad de Ingeniería",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-11"),
  },
  {
    id: "22",
    name: "Kit de Herramientas Completo",
    description:
      "Caja de herramientas con más de 100 piezas para reparaciones y proyectos. Pago únicamente en efectivo.",
    price: 15,
    priceUnit: "hour",
    category: "Herramientas",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Valeria Sánchez",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Laboratorio de Mecánica, Piso 1",
    returnAddress: "UCSP, Laboratorio de Mecánica, Piso 1",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-16"),
  },
  {
    id: "23",
    name: "Soldadora Eléctrica",
    description: "Soldadora eléctrica portátil con accesorios de seguridad incluidos. Pago únicamente en efectivo.",
    price: 35,
    priceUnit: "hour",
    category: "Herramientas",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Gustavo Mendoza",
    university: "UCSM",
    available: true,
    pickupAddress: "UCSM, Taller de Soldadura, Edificio Industrial",
    returnAddress: "UCSM, Taller de Soldadura, Edificio Industrial",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-21"),
  },

  // Libros
  {
    id: "24",
    name: "Colección Ingeniería Civil",
    description: "Set de 15 libros especializados en ingeniería civil y construcción. Pago únicamente en efectivo.",
    price: 8,
    priceUnit: "hour",
    category: "Libros",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Elena Paredes",
    university: "UTP",
    available: true,
    pickupAddress: "UTP, Biblioteca de Ingeniería, Piso 3",
    returnAddress: "UTP, Biblioteca de Ingeniería, Piso 3",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-07"),
  },
  {
    id: "25",
    name: "Libros de Medicina Humana",
    description: "Colección de libros de anatomía, fisiología y medicina general. Pago únicamente en efectivo.",
    price: 10,
    priceUnit: "hour",
    category: "Libros",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Dr. Ricardo Molina",
    university: "UNSA",
    available: true,
    pickupAddress: "UNSA, Biblioteca de Medicina, Sala de Consulta",
    returnAddress: "UNSA, Biblioteca de Medicina, Sala de Consulta",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-13"),
  },
  {
    id: "26",
    name: "Manuales de Programación",
    description: "Libros especializados en Python, Java, JavaScript y desarrollo web. Pago únicamente en efectivo.",
    price: 6,
    priceUnit: "hour",
    category: "Libros",
    image: "/placeholder.svg?height=300&width=400",
    owner: "Alejandro Cruz",
    university: "UCSP",
    available: true,
    pickupAddress: "UCSP, Laboratorio de Sistemas, Edificio de Ingeniería",
    returnAddress: "UCSP, Laboratorio de Sistemas, Edificio de Ingeniería",
    paymentMethod: "efectivo",
    createdAt: new Date("2024-02-17"),
  },
]

export const categories = ["Todos", "Electrónicos", "Deportes", "Música", "Herramientas", "Libros"]

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: Date
  type: "welcome" | "rental" | "system"
}

// Las notificaciones iniciales ahora solo incluyen el mensaje de bienvenida
export const getInitialNotifications = (): Notification[] => [
  {
    id: "welcome",
    title: "¡Bienvenido a Rent+All!",
    message:
      "Gracias por unirte a nuestra comunidad de estudiantes. Explora productos disponibles y comienza a alquilar.",
    read: false,
    timestamp: new Date(),
    type: "welcome",
  },
]

export const getAvailableProducts = (rentedProductIds: string[] = []): Product[] => {
  return mockProducts.filter((product) => !rentedProductIds.includes(product.id))
}
