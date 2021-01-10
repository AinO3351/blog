import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import Header from '../../components/header'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import Head from 'next/head'
import { CMS_NAME } from '../../lib/constants'
import markdownToHtml from '../../lib/markdownToHtml'
import BasicPage from '../../layouts/basic-page'

export default function Post({ post, morePosts, preview }) {
    const router = useRouter()
    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404} />
    }
    return (
        <BasicPage post={post} router={router}>
            <article className="mb-32 max-w-screen-xl">
                <Head>
                    <title>
                        {post.title} | {CMS_NAME}
                    </title>
                    <meta property="og:image" content={post.ogImage.url} />
                </Head>
                <PostBody content={post.content} />
            </article>
        </BasicPage>

    )
}

export async function getStaticProps({ params }) {
    const post = getPostBySlug(params.slug, [
        'title',
        'subtitle',
        'summary',
        'date',
        'slug',
        'author',
        'content',
        'ogImage',
        'coverImage',
        'color'
    ])
    const content = await markdownToHtml(post.content || '')

    return {
        props: {
            post: {
                ...post,
                content,
            },
        },
    }
}

export async function getStaticPaths() {
    const posts = getAllPosts(['slug'])

    return {
        paths: posts.map((post) => {
            return {
                params: {
                    slug: post.slug,
                },
            }
        }),
        fallback: false,
    }
}
