export function parseCustomFormat(input: string): { [key: string]: string | number } {
    const result: { [key: string]: string | number } = {};
  
    // Eliminar el caracter inicial "¨" y el final "*" (si existen)
    input = input.replace(/^¨/, '').replace(/\*$/, '');
  
    // Dividir la cadena utilizando el delimitador exacto "[,["
    let segments = input.split("[,[");
    
    // Aseguramos que cada segmento tenga un "[" al inicio
    segments = segments.map(seg => {
      seg = seg.trim();
      if (!seg.startsWith("[")) {
        seg = "[" + seg;
      }
      return seg;
    });
  
    // Procesamos cada segmento
    segments.forEach(segment => {
      // Expresión regular que extrae:
      // - Grupo 1: la clave (todo lo que está entre "[" y "[Ñ[")
      // - Grupo 2: el valor (el resto del segmento)
      const regex = /^\[([^[]+)\[Ñ\[(.+)$/;
      const match = segment.match(regex);
      if (match) {
        const key = match[1].trim();
        let valueStr = match[2].trim();
  
        // Si existe un corchete sobrante al final (por ejemplo, "DP["), lo removemos
        valueStr = valueStr.replace(/\[$/, '');
        
        // Si la clave es "codigo", reemplazamos los apóstrofes por guiones
        if (key === "codigo") {
          valueStr = valueStr.replace(/'/g, "-");
        }
  
        // Convertir el valor a número si es posible
        const num = Number(valueStr);
        result[key] = isNaN(num) ? valueStr : num;
      }
    });
  
    return result;
  }
  