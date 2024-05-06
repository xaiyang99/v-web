import React, { useEffect, useState } from "react";

import { Box, Grid, useMediaQuery } from "@mui/material";

//component
import { useLazyQuery } from "@apollo/client";
import "swiper/css";
import { EventUploadTriggerContext } from "../../../contexts/EventUploadTriggerContext";
import { ConvertBytetoMBandGB } from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import "../../dashboards/css/style.css";
import { DashboardContainer, DashboardItem } from "../css/dashboardStyle";
import { QUERY_ANNOUNCEMENTS, QUERY_GET_SPACE } from "./apollo";
import GraphSpace from "./components/chart/GraphSpace";
import MostDownload from "./components/most-download/MostDownload";
import StatisticsFileType from "./components/statistic-file-type/StatisticsFileType";
import StatisticsFileTypeItem from "./components/statistic-file-type/StatisticsFileTypeItem";
import TotalCard from "./components/total-card/TotalCard";
import useFetchFileByMostDownload from "./hooks/useFetchFileByMostDownload";
import useFetchFiles from "./hooks/useFetchFiles";
import useFilterFileByDate from "./hooks/useFilterFileByDate";
import useFilterFileByType from "./hooks/useFilterFileByType";
import useFilterFileTotal from "./hooks/useFilterFileTotal";
// import * as Icon from "./icons";
// import required modules

const ITEM_PER_PAGE = 5;
const Index = () => {
  const { user } = useAuth();
  const [dataFilter, setDataFilter] = useState({});
  const isMobile = useMediaQuery("(max-width:768px)");
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const [getSpace, { data: dataSpace }] = useLazyQuery(QUERY_GET_SPACE, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (eventUploadTrigger?.triggerData?.isTriggered) {
      getSpace();
    }
  }, [eventUploadTrigger?.triggerData]);

  useEffect(() => {
    getSpace();
  }, []);

  const [currentMostDownloadPage, setCurrentMostDownloadPage] = useState(1);

  useEffect(() => {
    setDataFilter((prevState) => {
      const result = {
        ...prevState,
        skip: (currentMostDownloadPage - 1) * ITEM_PER_PAGE,
      };
      if (currentMostDownloadPage - 1 === 0) {
        delete result.skip;
      }
      return result;
    });
  }, [currentMostDownloadPage]);

  //data files without filters
  const dataFiles = useFetchFiles({
    user,
  });

  //files query
  const { data: totalList } = useFilterFileTotal({
    totalStorage: user?.storage,
    files: dataFiles.data,
    dataSpace,
  });

  //weekly, monthly, yearly
  const [selectValue, setSelectValue] = React.useState("weekly");
  const { labels, data: graphData } = useFilterFileByDate({
    options: selectValue,
    files: dataFiles.data,
  });

  // file types
  const totalTypeList = useFilterFileByType({ files: dataFiles.data });

  // most download
  //data files with filters
  const fileByMostDownload = useFetchFileByMostDownload({
    user,
    dataFilter: {
      data: dataFilter,
      limit: ITEM_PER_PAGE,
    },
  });

  const [listAnouncement] = useLazyQuery(QUERY_ANNOUNCEMENTS, {
    fetchPolicy: "no-cache",
  });

  const handleAnnouncement = async () => {
    await listAnouncement({
      variables: {
        orderBy: "updatedAt_DESC",
        where: {
          status: "published",
          notificationTo: "customer",
        },
      },
    });
  };

  /*   React.useEffect(() => {
    handleAnnouncement();
  }, [listAnouncement]); */

  return (
    <DashboardContainer
      sx={{
        ...(isMobile
          ? {
              padding: (theme) => theme.spacing(5),
              marginTop: (theme) => theme.spacing(5),
              marginBottom: (theme) => theme.spacing(5),
            }
          : {
              marginTop: (theme) => theme.spacing(5),
            }),
      }}
    >
      <DashboardItem>
        {isMobile ? (
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#fff" : "#fff",
              borderRadius: "8px",
              padding: (theme) => theme.spacing(5),
              boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
            }}
          >
            <Grid container spacing={5}>
              {totalList.map((totalItem, index) => {
                return (
                  <Grid item xs={6} sm={6} md={3} lg={3} key={index}>
                    <TotalCard {...totalItem} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          <Grid container spacing={5}>
            {totalList.map((totalItem, index) => {
              return (
                <Grid item xs={6} sm={6} md={6} lg={3} key={index}>
                  <TotalCard {...totalItem} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </DashboardItem>
      {/* <DashboardItem sx={{ margin: "10px" }}>
        <Box sx={{ width: "99%" }}>
          <Swiper
            spaceBetween={5}
            slidesPerView={4}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {isAnouncement?.getAnnouncement?.data?.map((item, index) => (
              <SwiperSlide key={index}>
                <Grid
                  container
                  spacing={5}
                  sx={{ mt: 3, width: "100%", marginLeft: "0" }}
                >
                  <Grid item sx={12} md={12}>
                    <SliderAnnouncement title={item.title} image={item.image} />
                  </Grid>
                </Grid>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </DashboardItem> */}
      <DashboardItem>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <GraphSpace
              {...{
                packageName: user?.packageId?.name,
                ...(dataFiles.data.totalSize && {
                  usedSpace: ConvertBytetoMBandGB(
                    Number(dataFiles.data.totalSize),
                  ),
                }),
                ...(user?.storage && {
                  totalSpace: ConvertBytetoMBandGB(
                    Number(dataSpace?.getSpaces?.totalStorage || 0),
                  ),
                }),
              }}
              data={graphData}
              labels={labels}
              select={{
                value: selectValue,
                onChange: (e) => {
                  setSelectValue(e);
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MostDownload
              onSearch={(e) =>
                setDataFilter((prevState) => {
                  setCurrentMostDownloadPage(1);
                  const result = {
                    ...prevState,
                    filename: e,
                  };
                  if (e) {
                    delete result.skip;
                  }

                  return result;
                })
              }
              data={fileByMostDownload.data}
              total={fileByMostDownload.total}
              pagination={{
                total:
                  Math.ceil(fileByMostDownload.total / ITEM_PER_PAGE) > 4
                    ? 4
                    : Math.ceil(fileByMostDownload.total / ITEM_PER_PAGE),
                currentPage: currentMostDownloadPage,
                setCurrentPage: setCurrentMostDownloadPage,
              }}
            />
          </Grid>
        </Grid>
      </DashboardItem>
      <DashboardItem>
        <StatisticsFileType>
          <Grid container rowSpacing={5} columnSpacing={2}>
            {totalTypeList.map((totalItem, index) => {
              return (
                <Grid item xs={4} sm={4} md={3} lg={2} key={index}>
                  <StatisticsFileTypeItem {...totalItem} />
                </Grid>
              );
            })}
          </Grid>
        </StatisticsFileType>
      </DashboardItem>
      {/* <DashboardItem>
        <Grid container spacing={5}>
          <Grid item xs={12} md={5} lg={4}>
            <Traffic>
              {trafficTotal.map((trafficItem, index) => {
                return <TrafficItem {...trafficItem} key={index} />;
              })}
            </Traffic>
          </Grid>
          <Grid item xs={12} md={7} lg={8}>
            <MostDownload
              onSearch={(e) =>
                setDataFilter((prevState) => {
                  setCurrentMostDownloadPage(1);
                  const result = {
                    ...prevState,
                    filename: e,
                  };
                  if (e) {
                    delete result.skip;
                  }

                  return result;
                })
              }
              data={dataFilesFiltered.data}
              total={dataFilesFiltered.total}
              pagination={{
                total: Math.ceil(dataFilesFiltered.total / ITEM_PER_PAGE),
                currentPage: currentMostDownloadPage,
                setCurrentPage: setCurrentMostDownloadPage,
              }}
            />
          </Grid>
        </Grid>
      </DashboardItem> */}
    </DashboardContainer>
  );
};

export default Index;
