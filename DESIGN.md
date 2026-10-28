# Diseño de ESAN Emprende
Interfaz de catálogo y operación para estudiantes que exploran desde el celular entre clases. Identidad provisional independiente; no replica una marca oficial de ESAN.

Fondo marfil #fbfbf8, tinta #242a27, rojo #bd302f, verde #254638, texto secundario #68706a, bordes #e2e5de. Manrope para titulares, DM Sans para texto, ambas autoalojadas. Titulares con tracking -0.035em, cuerpo de 14 px. Ritmo de 8 px, contenedor de 1280 px al 90% de ancho. Radios de 6 px en controles y 10–16 px en fotografía y superficies.

Catálogo fotográfico, filtros visibles, búsqueda inmediata y favoritos accesibles. Tres columnas en escritorio, dos en móvil (breakpoint de 760 px). La fotografía lidera el contenido; no hay animación de entrada que esconda información. Transición de zoom breve al explorar una foto. Se respeta movimiento reducido. Diálogos nativos para detalles y formulario con foco contenido y Escape. Todos los ejemplos están identificados como demo.

## Acceso institucional
Modo Operate. El catálogo público abre directamente sin cuenta. `/acceso` hereda la identidad del catálogo: presentación breve a la izquierda y formulario por enlace a la derecha; en móvil el formulario sigue al texto sin fotografía. Mi negocio y la publicación requieren una cuenta con correo `@ue.edu.pe` verificado. Tras verificar el enlace de un solo uso, la persona regresa a Mi negocio. Incluye espera, fallo, confirmación de envío y errores de enlace vencido. Etiqueta de correo visible, feedback anunciado y botón deshabilitado durante envío; no pide contraseña.

Las visitas públicas no muestran estado de sesión. La banda superior distingue la vista de visitante de la sesión institucional y de la vista previa local. Solo las cuentas verificadas acceden al espacio privado del negocio.


## Components

### Extensión del catálogo y destacados

Esta ampliación conserva la identidad clara con acento rojo, las tipografías, los tokens CSS y los patrones de tarjetas y controles existentes. La referencia al escaparate de Epic se limita a la organización de un destacado grande con una lista de opciones; no sustituye la identidad del catálogo por un tema oscuro.

El escaparate combina una propuesta principal con cuatro opciones seleccionables y controles anterior, siguiente y pausa/reproducción. Avanza cada 6 segundos mientras está activo; el cursor lo detiene temporalmente y recibir foco lo deja pausado hasta reproducirlo expresamente. Con movimiento reducido comienza sin avance automático y mantiene la navegación manual; también pausa al ocultarse la pestaña. Los destacados y la selección del catálogo son ilustrativos, sin ranking ni ventas registradas.

El directorio de categorías muestra cantidades de propuestas y conduce al catálogo filtrado. El directorio de emprendimientos agrupa por negocio para evitar duplicados. Cada perfil presenta creador, descripción, categorías y su catálogo completo de productos, servicios e ideas; búsqueda y filtros permiten explorar ese catálogo. Las fichas conservan fotografía para productos físicos y usan ilustraciones con iconos para soluciones digitales e ideas. Las ideas muestran «Busco colaboradores» y las propuestas sin precio «A cotizar».

La publicación local añade el tipo producto, servicio o idea y permite elegir imágenes de ejemplo. Contacto, subida de imágenes propias, ventas y persistencia compartida siguen pendientes; los botones de contacto muestran un aviso de demostración. Las estadísticas del panel también siguen siendo ilustrativas.

## Mi negocio y editor
El panel operativo prioriza perfil y publicaciones. El perfil usa una superficie verde suave; los formularios tienen etiquetas visibles y controles de 44 px o más. Crear y editar comparten el mismo editor, con dos pasos: Preparar y Revisar. En escritorio separa contenido e imagen en dos columnas; en móvil se apilan. El detalle de vista previa usa la misma identidad del catálogo. Eliminar requiere confirmación junto a la publicación; abandonar el editor por su acción Volver/Cancelar pide confirmar si hay cambios. La información comercial sigue siendo de demo local.

## Rendimiento y móvil
Las fotografías de referencia ahora se publican separadas en WebP (demo-v1), con Next/Image, tamaños responsivos y object-fit cover para conservar proporciones. Solo la foto inicial de destacados se precarga; las tarjetas inferiores y miniaturas usan carga diferida. Los derivados tienen caché inmutable; la lámina original se conserva fuera de public. En móvil, el destacado tiene una foto y un texto más compactos; la selección de emprendimientos es horizontal. Las categorías se muestran en chips, sin repetir el directorio de escritorio. Favoritos, controles de carrusel y navegación tienen superficies de al menos 44 px. El buscador ocupa una fila completa.

## Adaptación editorial REA (octubre de 2026)

La implementación principal vive en Next.js, no en demo-sites. El análisis y la matriz por referencia están en docs/rea-ui-integration.md. Se incorporan navegación, filtros, tema y detalle ampliado de la demo histórica a los componentes React; los estilos editoriales se centralizan en src/app/editorial.css, después de globals.css para preservar los flujos existentes.

Tokens: marfil #f8f7f4, superficie #ffffff, tinta #20211e, acento #a42932, verde #334b40, texto secundario #62665e, borde #dedfd8. Tema oscuro: fondo #171a18, superficie #202520, tinta #f1f2ec, secundario #b7c0b4, acento #ef969d, borde #414a40. Manrope para títulos y DM Sans para lectura. Contenedor 1440px máximo/92%, hero de dos columnas con fotografía, tarjetas de cuatro columnas (tres en tablet y dos en móvil), perfiles de dos columnas que se apilan en móvil. Radios de 8–12px en fotografía y 2–4px en controles. No se copian activos ni claims comerciales ajenos.

Inicio presenta una selección editorial; Explorar filtra por texto, tipo, categoría y disponibilidad. Navegación con hash permite compartir vistas e historial; las reseñas y el contacto viven en el detalle. Ajustes reúne tema y respaldo de datos. Los perfiles demo no fabrican canales ni reseñas; los perfiles propios pueden configurar sus enlaces. Los formularios retienen validaciones y foco visible. Se respeta prefers-reduced-motion.
