import { intToPrettyString } from "../../../../../functions";

const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    Object.assign(tooltipEl.style, {
      background: "#FFF",
      borderRadius: "3px",
      color: "#000",
      opacity: 1,
      border: "1px solid rgba(75,70,92,.25)",
      borderRadius: "8px",
      pointerEvents: "none",
      position: "absolute",
      transform: "translate(-50%, 0)",
      transition: "all .2s ease",
      padding: 0,
    });

    const table = document.createElement("table");
    Object.assign(table.style, {
      margin: 0,
      padding: 0,
      borderSpacing: 0,
    });

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement("thead");
    titleLines.forEach((title) => {
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      Object.assign(th.style, {
        borderBottom: "1px solid rgba(75,70,92,.25)",
        padding: "4px 8px",
      });
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement("tbody");
    bodyLines.forEach((body, i) => {
      const dataPoint = tooltip.dataPoints[0];
      const maleData =
        dataPoint.dataset.externalData.maleList[dataPoint.dataIndex];
      const femaleData =
        dataPoint.dataset.externalData.femaleList[dataPoint.dataIndex];
      /* const span = document.createElement("span");
      Object.assign(span.style, {
        background: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderWidth: "2px",
        marginRight: "10px",
        height: "10px",
        width: "10px",
        display: "inline-block",
      }); */

      const firstTr = document.createElement("tr");
      firstTr.style.backgroundColor = "inherit";
      firstTr.style.borderWidth = 0;

      const firstTd = document.createElement("td");
      firstTd.style.borderWidth = 0;
      Object.assign(firstTd.style, {
        borderWidth: 0,
        padding: "4px 8px",
      });

      const firstText = document.createTextNode(intToPrettyString(body));

      const secondTr = document.createElement("tr");
      secondTr.style.backgroundColor = "inherit";
      secondTr.style.borderWidth = 0;

      const secondTd = document.createElement("td");
      secondTd.style.borderWidth = 0;
      Object.assign(secondTd.style, {
        borderWidth: 0,
        padding: "4px 8px",
      });

      const secondText = document.createTextNode(
        `M ${intToPrettyString(maleData)}, FM ${intToPrettyString(femaleData)}`
      );

      /* td.appendChild(span); */
      firstTd.appendChild(firstText);
      firstTr.appendChild(firstTd);
      tableBody.appendChild(firstTr);
      secondTd.appendChild(secondText);
      secondTr.appendChild(secondTd);
      tableBody.appendChild(secondTr);
    });

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = 5 + positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  /* tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px"; */
};
