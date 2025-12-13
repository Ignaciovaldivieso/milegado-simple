// app/api/generar-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generar el contenido HTML del testamento
    const htmlContent = generarHTMLTestamento(data);
    
    // Por ahora, devolvemos el HTML
    // En producción, aquí convertiríamos a PDF
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': 'attachment; filename="testamento.html"',
      },
    });
    
  } catch (error) {
    console.error('Error generando testamento:', error);
    return NextResponse.json(
      { error: 'Error al generar el testamento' },
      { status: 500 }
    );
  }
}

function generarHTMLTestamento(data: any): string {
  const fechaActual = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testamento de ${data.nombre} ${data.apellido}</title>
    <style>
        @page {
            margin: 2.5cm;
        }
        
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            max-width: 21cm;
            margin: 0 auto;
            padding: 2cm;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2cm;
            border-bottom: 2px solid #000;
            padding-bottom: 1cm;
        }
        
        .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        
        .header p {
            margin: 0.5cm 0 0 0;
            font-size: 11pt;
        }
        
        .section {
            margin-bottom: 1.5cm;
            text-align: justify;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 0.5cm;
            text-transform: uppercase;
        }
        
        .clause {
            margin-bottom: 0.8cm;
            padding-left: 1cm;
            text-indent: -1cm;
        }
        
        .clause-number {
            font-weight: bold;
        }
        
        .beneficiarios-list {
            margin-left: 2cm;
            margin-top: 0.5cm;
        }
        
        .firma-section {
            margin-top: 3cm;
            page-break-inside: avoid;
        }
        
        .firma-line {
            border-top: 1px solid #000;
            width: 8cm;
            margin: 2cm auto 0.3cm auto;
        }
        
        .firma-text {
            text-align: center;
            font-size: 10pt;
        }
        
        .footer {
            margin-top: 2cm;
            padding-top: 1cm;
            border-top: 1px solid #ccc;
            font-size: 9pt;
            text-align: center;
            color: #666;
        }
        
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Testamento Abierto</h1>
        <p>Otorgado por ${data.nombre} ${data.apellido}</p>
        <p>RUT: ${data.rut}</p>
    </div>

    <div class="section">
        <div class="section-title">I. Identificación del Testador</div>
        <p>
            En ${data.ciudad}, a ${fechaActual}, comparece don(ña) <strong>${data.nombre} ${data.apellido}</strong>, 
            cédula nacional de identidad número <strong>${data.rut}</strong>, de estado civil <strong>${data.estadoCivil}</strong>, 
            nacido(a) el ${new Date(data.fechaNacimiento).toLocaleDateString('es-CL')}, con domicilio en 
            <strong>${data.direccion}, ${data.ciudad}</strong>, quien declara encontrarse en pleno uso de sus 
            facultades mentales y actuar libre de coacción, otorgando el presente testamento conforme a las 
            disposiciones del Código Civil de Chile.
        </p>
    </div>

    <div class="section">
        <div class="section-title">II. Revocación de Testamentos Anteriores</div>
        <p class="clause">
            <span class="clause-number">PRIMERO:</span> Por el presente acto, revoco expresamente cualquier 
            testamento, codicilo o disposición testamentaria que hubiere otorgado con anterioridad a la fecha 
            del presente instrumento, dejando sin efecto toda disposición anterior incompatible con lo aquí establecido.
        </p>
    </div>

    <div class="section">
        <div class="section-title">III. Declaración de Bienes</div>
        <p class="clause">
            <span class="clause-number">SEGUNDO:</span> Declaro que al momento de otorgar este testamento, 
            mi patrimonio se compone, entre otros, de los siguientes bienes:
        </p>
        <div style="margin-left: 2cm; margin-top: 0.5cm; white-space: pre-line;">
${data.bienes}
        </div>
    </div>

    <div class="section">
        <div class="section-title">IV. Designación de Herederos y Legatarios</div>
        <p class="clause">
            <span class="clause-number">TERCERO:</span> Es mi voluntad que mis bienes sean distribuidos de 
            la siguiente manera, respetando las legítimas que correspondan según la ley:
        </p>
        <div style="margin-left: 2cm; margin-top: 0.5cm; white-space: pre-line;">
${data.beneficiarios}
        </div>
    </div>

    ${data.instruccionesEspeciales ? `
    <div class="section">
        <div class="section-title">V. Instrucciones Especiales</div>
        <p class="clause">
            <span class="clause-number">CUARTO:</span> Además de lo anteriormente dispuesto, es mi voluntad 
            expresar las siguientes instrucciones especiales:
        </p>
        <div style="margin-left: 2cm; margin-top: 0.5cm; white-space: pre-line;">
${data.instruccionesEspeciales}
        </div>
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">${data.instruccionesEspeciales ? 'VI' : 'V'}. Disposiciones Generales</div>
        <p class="clause">
            <span class="clause-number">${data.instruccionesEspeciales ? 'QUINTO' : 'CUARTO'}:</span> 
            Declaro que este testamento refleja fielmente mi voluntad y ha sido otorgado en pleno uso de 
            mis facultades mentales, sin presión ni coacción de ninguna naturaleza.
        </p>
        <p class="clause">
            <span class="clause-number">${data.instruccionesEspeciales ? 'SEXTO' : 'QUINTO'}:</span> 
            Para todos los efectos legales derivados de este testamento, fijo mi domicilio en 
            ${data.direccion}, ${data.ciudad}, Chile.
        </p>
    </div>

    <div class="firma-section">
        <p style="text-align: center; margin-bottom: 1cm;">
            Así lo otorgo y firmo en ${data.ciudad}, a ${fechaActual}.
        </p>
        
        <div class="firma-line"></div>
        <div class="firma-text">
            <strong>${data.nombre} ${data.apellido}</strong><br>
            RUT: ${data.rut}<br>
            Firma del Testador
        </div>
    </div>

    <div class="footer">
        <p>
            <strong>IMPORTANTE:</strong> Este documento es un borrador de testamento generado por MiLegado.<br>
            Para que tenga validez legal, debe ser otorgado ante notario público conforme al artículo 1011 y 
            siguientes del Código Civil de Chile.<br>
            Se recomienda consultar con un abogado especialista antes de su formalización.
        </p>
        <p style="margin-top: 0.5cm; font-size: 8pt;">
            Documento generado el ${fechaActual} mediante www.milegado.cl
        </p>
    </div>
</body>
</html>
  `;
}