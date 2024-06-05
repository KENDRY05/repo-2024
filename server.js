
const http = require('http');


function handleRequest(req, res) {
    if (req.method === 'POST') {
        let body = '';

        // Lee los datos del cuerpo de la solicitud
        req.on('data', chunk => {
            body += chunk.toString();
        });

        
        req.on('end', () => {
            // Extrae el nombre del cuerpo de la solicitud (se espera que sea en formato nombre=Juan)
            const params = new URLSearchParams(body);
            const nombre = params.get('nombre');

            // Establece el código de estado de la respuesta a 200 (OK)
            res.statusCode = 200;
            // Establece el encabezado de contenido como texto plano
            res.setHeader('Content-Type', 'text/plain');
            // Envía una respuesta con el mensaje personalizado
            res.end(`Hola, ${nombre}!`);
        });
    } else {
        // Si no es una solicitud POST, responde con un mensaje de error
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Método no permitido');
    }
}


const server = http.createServer(handleRequest)
server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
