/**
 * Leibniz: los documentos (D2). Página de referencia histórica, sin matemática nueva.
 *
 * Regla de admisión: cada afirmación histórica lleva su fuente. Aquí no hay cifras que
 * asertar; la suite comprueba que la entrada existe y está bien etiquetada, y estas
 * fuentes acompañan cada hito en la página.
 */

export interface Hito {
  fecha: string;
  titulo: string;
  texto: string;
  fuente: string;
}

export const HITOS: Hito[] = [
  {
    fecha: "siglo XI",
    titulo: "Shao Yong ordena los 64",
    texto:
      "Shao Yong (邵雍, 1011–1077) formaliza la disposición 'del Cielo Anterior' (先天): los 64 hexagramas en el orden que hoy leemos como binario. Su motivación era cosmológica y numerológica, no aritmética.",
    fuente: "Ryan, J. A. (1996), Philosophy East and West 46(1), 59–90.",
  },
  {
    fecha: "circa 1679",
    titulo: "Leibniz inventa el binario",
    texto:
      "Mucho antes de conocer el I Ching, Leibniz (1646–1716) ya había desarrollado la aritmética binaria; su manuscrito De Progressione Dyadica es de 1679.",
    fuente: "Leibniz, De Progressione Dyadica (1679), manuscrito; ver Archivo Leibniz de Hannover.",
  },
  {
    fecha: "noviembre de 1701",
    titulo: "La carta de Bouvet",
    texto:
      "El jesuita Joachim Bouvet (1656–1730), misionero en China, escribe a Leibniz y le envía el diagrama de los hexagramas de Fu Xi, señalando su parecido con la numeración binaria. La carta llega a Leibniz en 1703.",
    fuente: "Correspondencia Bouvet–Leibniz; ver Ryan (1996) y el Archivo Leibniz.",
  },
  {
    fecha: "1703",
    titulo: "La Explication de l'Arithmétique Binaire",
    texto:
      "Leibniz publica su exposición del sistema binario y, en ella, reconoce la identidad estructural con los hexagramas de Fu Xi que le había enviado Bouvet. Es el primer puente documentado entre el I Ching y el binario europeo.",
    fuente:
      "Leibniz, G. W. (1703), 'Explication de l'Arithmétique Binaire', Mémoires de l'Académie Royale des Sciences, París.",
  },
];

/** El descargo honesto, visible (no al pie). */
export const DESCARGO =
  "Los chinos no practicaban aritmética binaria. Shao Yong buscaba una cosmología; los hexagramas eran símbolos, no números que se sumaran. Fue Leibniz quien, con su binario ya inventado, reconoció la coincidencia de estructura. La identidad es real como forma; la lectura de que 'China inventó el binario' es un anacronismo.";
