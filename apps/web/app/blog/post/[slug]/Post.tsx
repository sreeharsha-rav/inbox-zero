import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PortableText,
  PortableTextBlock,
  PortableTextComponentProps,
} from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { BlogLayout } from "@/components/layouts/BlogLayout";
import type { Post as PostType } from "@/app/blog/types";
import { Prose } from "@/app/blog/components/Prose";
import { TableOfContents } from "@/app/blog/components/TableOfContents";
import { Card, CardContent } from "@/components/ui/card";
import { extractTextFromPortableTextBlock, slugify } from "@/utils/text";
import { TryInboxZero } from "@/app/blog/components/TryInboxZero";
import { ReadMore } from "@/app/blog/components/ReadMore";

const builder = imageUrlBuilder(client);

export function Post({ post }: { post: PostType }) {
  return (
    <BlogLayout>
      <article className="mx-auto grid w-full max-w-screen-xl gap-5 px-0 pt-16 md:grid-cols-4 md:pt-24 lg:gap-4 lg:px-20">
        <main className="md:col-span-3">
          <Card>
            <CardContent className="p-10">
              <Prose>
                <h1>{post.title}</h1>
                <p>{post.description}</p>
                {post.mainImage ? (
                  <div className="-mx-10 my-8">
                    <Image
                      src={builder
                        .image(post.mainImage)
                        .width(1200)
                        .height(675)
                        .url()}
                      alt={post?.mainImage?.alt || ""}
                      width={1200}
                      height={675}
                      className="h-auto w-full"
                    />
                  </div>
                ) : null}
                {post.body ? (
                  <PortableText
                    value={post.body}
                    components={{
                      block: {
                        h2: createHeadingComponent("h2"),
                        h3: createHeadingComponent("h3"),
                      },
                    }}
                  />
                ) : null}
              </Prose>
            </CardContent>
          </Card>

          <div className="mt-4">
            <ReadMore />
          </div>
        </main>
        <aside className="hidden md:block">
          <div className="sticky top-20">
            <div className="mb-4">
              <TryInboxZero />
            </div>

            <Card className="mb-4">
              <CardContent className="pt-6">
                <h3 className="mb-2 text-lg font-semibold">Written by</h3>
                <div className="flex items-center">
                  {post.authorImage && (
                    <Image
                      src={builder
                        .image(post.authorImage)
                        .width(40)
                        .height(40)
                        .url()}
                      alt={post.authorName ?? ""}
                      className="mr-3 h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                  <div>
                    <p className="font-medium">{post.authorName}</p>
                    {post.authorTwitter && (
                      <Link
                        href={`https://twitter.com/${post.authorTwitter}`}
                        className="text-sm text-gray-500"
                        target="_blank"
                      >
                        @{post.authorTwitter}
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {post.body && (
              <Card>
                <CardContent className="pt-6">
                  <TableOfContents body={post.body} />
                </CardContent>
              </Card>
            )}
          </div>
        </aside>
      </article>
    </BlogLayout>
  );
}

const createHeadingComponent =
  (Tag: "h2" | "h3") =>
  ({ children, value }: PortableTextComponentProps<PortableTextBlock>) => {
    const text = extractTextFromPortableTextBlock(value);
    const id = slugify(text);

    return (
      <Tag id={id}>
        <Link href={`#${id}`}>{children}</Link>
      </Tag>
    );
  };
