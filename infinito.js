// Lógica del contador
function actualizarCalendario() {
    const fechaInicio = new Date("2023-10-21T00:00:00"); // Fecha de inicio: 21/10/2023
    const ahora = new Date();

    // Diferencia en milisegundos entre la fecha actual y la fecha de inicio
    const diferencia = ahora.getTime() - fechaInicio.getTime();

    // Convertir la diferencia a días, horas, minutos y segundos
    const segundosTotales = Math.floor(diferencia / 1000);
    const dias = Math.floor(segundosTotales / (3600 * 24));
    const horas = Math.floor((segundosTotales % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundosTotales % 3600) / 60);
    const segundos = segundosTotales % 60;

    // Mostrar el contador en la página
    document.getElementById("dias").innerText = dias;
    document.getElementById("horas").innerText = String(horas).padStart(
      2,
      "0"
    );
    document.getElementById("minutos").innerText = String(minutos).padStart(
      2,
      "0"
    );
    document.getElementById("segundos").innerText = String(
      segundos
    ).padStart(2, "0");
  }

  // Actualizar el calendario cada segundo
  setInterval(actualizarCalendario, 1000);

  // Código para el efecto RGB en el canvas
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0, 1);
    }
  `;

  const fragmentShaderSource = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;

void main() {
    vec2 uv = v_uv * 2.0 - 1.0;
    
    // Ajusta el tamaño sin deformar el infinito:
    uv *= 0.35; // 2x más grande (0.5 = escala inversa)
    
    // Ecuación del símbolo infinito (∞) preservada:
    float r = 0.05 * cos(2.00 * atan(uv.y, uv.x)); // ¡Esta línea crea la forma de ∞!
    float d = dot(uv, uv);
    float s = 0.0003 / sqrt(d);
    float c = 1.0 - smoothstep(r, r + s, d) - smoothstep(r, r - s, d);
    
    // Colores y animación (sin cambios):
    vec3 p = vec3(0.5, 0.2, 0.33);
    r = sqrt(r);
    d = pow(d, 0.2) * 25.0;

    vec4 finalColor = vec4(0.0);
    for (float i = 1e-6; i < 1.0; i += 0.095) {
        float t = 1.0 + u_time * .5 + i;
        vec2 uv2 = uv + vec2(cos(t), sin(t)) * r;
        vec3 color = vec3(sin(t * 4.0), cos(t * 3.0), sin(t * 7.0));
        c = smoothstep(i / d, 0.0, length(uv2));
        finalColor += vec4(p * (1.0 + color) * c, c);
    }

    gl_FragColor = finalColor;
}

  `;

  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const timeLocation = gl.getUniformLocation(program, "u_time");

  function render(time) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  render();