import * as React from "react";

import Typography from "@mui/material/Typography";
import {
  AccordionContainer,
  AccordionDetails,
  AccordionSummary,
} from "../../client-dashboard/ticket/style";

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const AccordionData = [
    {
      id: Math.random() * 10,
      title: "How to create your first Pull Zone",
      panel: "panel1",
    },
    {
      id: Math.random() * 10,
      title: "How to set up a custom CDN hostname",
      panel: "panel2",
    },
    {
      id: Math.random() * 10,
      title: "How speed up your WordPress website with bunny.net",
      panel: "panel3",
    },
    {
      id: Math.random() * 10,
      title: "How to set up CDN Url Token Authentication",
      panel: "panel4",
    },
    {
      id: Math.random() * 10,
      title: "How to upload and access files from your Storage Zone",
      panel: "panel5",
    },
  ];

  return (
    <>
      {AccordionData.map((accord) => (
        <AccordionContainer
          expanded={expanded === accord?.panel}
          onChange={handleChange(accord?.panel)}
          key={accord?.id}
        >
          <AccordionSummary
            aria-controls={(accord?.panel, "-content")}
            id={(accord?.pane, "-header")}
          >
            <Typography variant="h4">{accord.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="span">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia
              dolore obcaecati reprehenderit non distinctio maxime illo
              officiis, explicabo doloribus fugiat aliquam neque illum dolores
              expedita corrupti. Dignissimos corrupti odit alias omnis modi eius
              illum hic dicta, itaque, velit ipsam eum excepturi, impedit soluta
              autem adipisci earum. Eligendi atque quia nemo!
            </Typography>
          </AccordionDetails>
        </AccordionContainer>
      ))}
    </>
  );
}
