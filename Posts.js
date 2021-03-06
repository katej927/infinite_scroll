import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Thumbnail from "./Thumbnail";
import FlexSet from "../../../../Styles/Common";
import { FEED_THUMBNAILS } from "../../../../Config";

export default function Posts(props) {
  const [postData, setPostData] = useState();
  const [offset, setOffset] = useState(1);
  //
  const [loading, setLoading] = useState(true);
  const [postAllData, setPostAllData] = useState();
  const [postsShow, setPostsShow] = useState();
  const [postPaging, setPostPaging] = useState(9);
  const { userAllData } = props;

  // 페이지 네이션 fetch
  // useEffect(() => {
  //   fetch("/data/personalFeed/post.json")
  //     // fetch(`${FEED_THUMBNAILS}/${props.match.params.id}?page=${offset}`)
  //     // fetch(`${FEED_THUMBNAILS}/${5}?page=${offset}`)
  //     .then((res) => res.json())
  //     .then((res) =>
  //       setPostData(postData ? postData.concat(res.post_list) : res.post_list),
  //     );
  // }, [offset]);

  // const showMoreBtn = () => {
  //   const nextOffset = offset + 1;
  //   setOffset(nextOffset);
  // };

  // 인피니티 스크롤 fetch
  const fetchInstaPosts = async () => {
    setLoading(true);

    await axios
      .get("/data/personalFeed/post.json")
      .then((response) => {
        // console.log("response.data.post_list", response.data.post_list);
        setPostAllData(response.data.post_list);
      })
      .catch((error) => {
        console.log("error", error);
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchInstaPosts();
  }, [offset]);

  // postsShow 필터링
  useEffect(() => {
    if (postAllData) {
      const filterShow = postAllData?.filter((post, idx) => idx < postPaging);
      setPostsShow(filterShow);
    }
  }, [postAllData, postPaging]); // 이부분 추후 수정(다음 데이터 필요할때)

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      setPostPaging(postPaging + 9);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <PostsWrapper>
      <MenuTap>
        {MENUTAPS_PERSONAL_FEED.map((btnName) => {
          return <Btns>{btnName}</Btns>;
        })}
      </MenuTap>
      {/* <Thumbnail postData={postData} /> */}
      <Thumbnail postData={postsShow} />
      {/* <ShowMoreBtn onClick={showMoreBtn}>더보기</ShowMoreBtn> */}
    </PostsWrapper>
  );
}

// menuTap Arr
const MENUTAPS_PERSONAL_FEED = ["게시물", "태그됨"];

// Styled Component
const PostsWrapper = styled.article`
  /* border: 1px solid pink; */
  width: 935px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const MenuTap = styled.section`
  /* border: 1px solid purple; */
  display: flex;
  justify-content: center;
  height: 53px;
`;

const Btns = styled.button`
  /* border: 1px solid rgba(var(--i1d, 38, 38, 38), 1); */
  border-top: 1px solid rgba(var(--i1d, 38, 38, 38), 1);
  height: 100%;
  margin-right: 60px;
  &:last-child {
    margin-right: 0px;
  }
  font-size: 12px;
  color: rgba(var(--f52, 142, 142, 142), 1);
`;

const ShowMoreBtn = styled.button`
  margin: auto;
  padding: 5px 34px;
  background-color: rgba(var(--ca6, 219, 219, 219), 1);
  border: 1px solid rgba(var(--ca6, 219, 219, 219), 1);
  border-radius: 4px;
  color: rgba(var(--f75, 38, 38, 38), 1);
  font-size: 14px;
  font-weight: bold;
`;
