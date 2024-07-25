import React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { PageHeader } from '~/components/PageHeader';
import { RiFileCopy2Line } from 'react-icons/ri';
import { Card } from '~/components/Card';
import { BaseCourse } from '~/types/api';
import Image from 'next/image';


interface CourseCardProps {
    course: BaseCourse;
}
const util = require("util");
const request = util.promisify(require("request"));
const getUrls = require("get-urls");

const urlImageIsAccessible = async url => {
  const correctedUrls = getUrls(https://news.mit.edu/2024/study-structured-randomization-ai-can-improve-fairness-0724);
  if (correctedUrls.size !== 0) {
    const urlResponse = await request(correctedUrls.values().next().value);
    const contentType = urlResponse.headers["content-type"];
    return new RegExp("image/*").test(contentType);
  }
};

const getImg = async (page, uri) => {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter(img => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      imgs.forEach(img =>
        img.src.indexOf("//") === -1
          ? (img.src = `${new URL(uri).origin}/${src}`)
          : img.src
      );
      return imgs[0].src;
    }
    return null;
  });
  return img;
};

const Blog: NextPage = () => (
    <>
        <PageHeader title="Blog" />
        <div className="container py-10">
            <h1>This weeks AI News</h1>
            <br/>
            <a href="https://news.mit.edu/2024/study-structured-randomization-ai-can-improve-fairness-0724" target="_blank" rel="noreferrer">
                <a className="no-underline">
                    <Card className="!p-0 duration-500 hover:-translate-y-2">
                        <img
                            src={getImg}
                            className="h-60 w-full object-cover rounded-t-2xl"
                        />
                        <div className="p-4">
                            <p className="inline-flex items-center text-slate-400">
                                <RiFileCopy2Line size={22} className="mr-2" />
                            </p>
                        </div>
                    </Card>
                </a>
            </a>
            <h2>Updates & Info</h2>
        </div>
    </>
);
export default Blog;
