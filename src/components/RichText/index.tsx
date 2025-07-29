import { MediaBlock } from '@/blocks/MediaBlock/index'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'


import type {
  MediaBlock as MediaBlockProps,
} from '@/cms-types'
import { cn } from '@/utilities/ui'
import { customListItemConverter } from './converts/itemNode'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode< MediaBlockProps >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
  console.log('hereJSX')
    console.log(defaultConverters)
  return({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  ...customListItemConverter,
  blocks: {
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
  },
})}

type Props = {
  data: any
 enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  console.log(props.data)

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'prose-custom',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}