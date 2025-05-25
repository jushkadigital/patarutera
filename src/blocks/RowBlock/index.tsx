import type { RowBlock, RowBlock as RowBlockType } from '@/cms-types'
import CardTour from '@/components/CardTour'
import { BASEURL } from '@/lib/config'
import { RenderBlocksRow } from '../renderBlockRow'
import { cn } from '@/lib/utils'

interface Props extends RowBlockType {

}

export async function RowBlock(props: Props) {
    const { columns } = props

    const wValues = {
      '25': 'w-[25%]',
      '33.333333': 'w-[33.333333%]',
      '50': 'w-[50%]',
      '66.666667' :'w-[66.666667%]',
      '75': 'w-[75%]',
      '100': 'w-full'

    }

    return (
        <div className='w-full flex flex-row '>
          {columns?.map(ele=>(
          <div className={wValues[ele.columnWidth]}>
        <RenderBlocksRow blocks={ele.columnBlocks} />
        </div>
          ))}
        </div>
        
    )
}