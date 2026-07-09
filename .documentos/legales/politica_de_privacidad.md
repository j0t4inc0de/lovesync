# Política de Privacidad y Tratamiento de Datos Personales — OurStory
**Última actualización: 9 de Julio, 2026**

En **OurStory**, el respeto y la protección de la intimidad de las parejas son el núcleo de nuestro diseño. Esta Política de Privacidad detalla con absoluta transparencia cómo recopilamos, utilizamos, resguardamos y purgamos tu información en estricto cumplimiento con la **Ley N° 19.628 sobre Protección de la Vida Privada de Chile** y las directrices globales de seguridad de Apple App Store y Google Play Store.

---

## 1. Almacenamiento en Nube Seguro con Cloudflare R2
> *"Las fotografías e imágenes de la bitácora de OurStory se transmiten mediante protocolos cifrados y se resguardan en servidores de la nube de Cloudflare R2 con el único objetivo de hacer posible la sincronización privada y en tiempo real entre los dos dispositivos móviles emparejados (`couple_id`). No se ceden, venden ni explotan con fines publicitarios ni de entrenamiento artificial."*

* **Cifrado Industrial:** Todas las fotografías y datos se transmiten mediante protocolos seguros **TLS 1.3 / HTTPS** y permanecen cifrados en reposo bajo el estándar **AES-256**.
* **Acceso Exclusivo:** Solamente los dos dispositivos móviles autorizados que comparten el identificador criptográfico de pareja (`couple_id`) pueden visualizar o descargar las imágenes de su álbum fotográfico privado.

---

## 2. Datos Personales Mínimos que Cuidamos
Bajo el principio de minimización de datos, únicamente solicitamos y procesamos la información estrictamente necesaria para que la aplicación funcione:
1. **Datos de Sesión:** Correo electrónico (utilizado como identificador de inicio de sesión y recuperación de contraseña) y tu nombre de perfil o apodo (`name`).
2. **Identificador de Pareja (`couple_id`):** El código relacional que vincula tu cuenta con la de tu pareja.
3. **Contenido de Bitácora compartida:** Títulos, fechas de citas, notas descriptivas y las fotografías adjuntas que tú y tu pareja deciden subir libremente a la línea de tiempo del álbum.
* **No rastreamos:** No accedemos a tus contactos del teléfono, ubicación georreferenciada en segundo plano ni al historial de navegación exterior de tu dispositivo.

---

## 3. Seguridad Bancaria y Pagos Externos (MercadoPago / Transbank)
La seguridad financiera de nuestros usuarios está totalmente separada y blindada:
* **Sin Almacenamiento de Tarjetas:** Nuestra aplicación y servidores **nunca recopilan, solicitan ni almacenan números de tarjetas de crédito o débito, códigos de seguridad CVV ni credenciales de Cuenta RUT o transacciones bancarias**.
* Todas las compras realizadas en la Tienda son procesadas e intermediadas externamente por pasarelas certificadas con el estándar internacional **PCI-DSS Nivel 1**, incluyendo **MercadoPago / Transbank (Webpay Plus)** en entorno web o **RevenueCat / Apple / Google** en dispositivos nativos. Nuestros servidores únicamente reciben un comprobante digital confirmando que el pago fue exitoso para acreditar los cupos adquiridos de forma automática en el perfil de la pareja.

---

## 4. Tu Derecho al Olvido y Eliminación de Datos (Ley N° 19.628 de Chile)
Reconocemos y garantizamos tu control absoluto sobre tu información e historia personal. Conforme a las normativas de Apple App Store, Google Play Store y el artículo 12 de la Ley N° 19.628 de Chile:
* **Eliminación Autónoma desde la App:** Puedes solicitar y ejecutar el borrado definitivo de tu cuenta y registros directamente desde la sección de Ajustes dentro de la aplicación en cualquier momento.
* **Destrucción Permanente en Cloudflare R2:** Al confirmar la eliminación de tu cuenta, tu perfil se borra de nuestra base de datos relacional y se activa un proceso automatizado que elimina permanentemente las fotografías físicas almacenadas bajo tu identificador de cuenta en los repositorios de Cloudflare R2 dentro de un plazo máximo no superior a **14 días corridos**, garantizando tu pleno Derecho al Olvido sin retenciones residuales u ocultas.

---

## 5. Oficial de Privacidad y Contacto
Si requieres ejercer tus derechos ARCO (Acceso, Rectificación, Cancelación u Oposición) o tienes cualquier duda sobre cómo se cuidan tus datos, puedes contactarnos en: **wearesamod@gmail.com**
