export const drawSvgVerticalLine = (
  container: Element,
  x: number,
  { className }: { className: string | undefined },
) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

  line.setAttribute("x1", `${x}`);
  line.setAttribute("y1", "0");
  line.setAttribute("x2", `${x}`);
  line.setAttribute("y2", `${container.clientHeight}`);
  line.setAttribute("stroke-width", "2");

  if (className) {
    line.setAttribute("class", className);
  }

  const overlayGroup = container.getElementsByTagName("g")[0];
  overlayGroup.appendChild(line);
};

export const drawSvgText = (
  container: Element,
  x: number,
  text: string,
  { className }: { className: string | undefined },
) => {
  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );

  textElement.setAttribute("x", `${x + 4}`);
  textElement.setAttribute("y", `${container.clientHeight - 2}`);
  textElement.innerHTML = text;

  if (className) {
    textElement.setAttribute("class", className);
  }

  const overlayGroup = container.getElementsByTagName("g")[0];
  overlayGroup.appendChild(textElement);
};

export const drawVerticalLineHighlightingToday = (x: number) => {
  const chartSvg = document.querySelectorAll(".chart svg");

  drawSvgVerticalLine(chartSvg[1], x, {
    className: "today",
  });

  drawSvgText(chartSvg[0], x, "Now", {
    className: "today-text",
  });

  drawSvgVerticalLine(chartSvg[0], x, {
    className: "today",
  });
};
