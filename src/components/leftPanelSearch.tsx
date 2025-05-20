'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'; // Asumiendo que tienes un componente Label o usa html label
import { Destination, TourCategory } from '@/cms-types';
import {parseAsArrayOf,useQueryState,parseAsString} from 'nuqs'

interface LeftPanelSearch {
  categories: TourCategory[];
  title?: string; // Optional title for the collapsible trigger
  destinations: Destination[];
}


export function LeftPanelSearch({categories,title,destinations}:LeftPanelSearch){
  return(
    <div className='flex flex-col w-full'>
      <TourSearchComponent destinations={destinations}/>
      <TourCategoryList categories={categories}/>
    </div>
  )
}

interface TourSearchComponentProps {
  destinations: Destination[];
}


function TourSearchComponent({destinations}:TourSearchComponentProps){
  
  const [isOpen, setIsOpen] = React.useState(false); // Default to open
  const [destino, setDestino] = useQueryState('destination',{shallow:false})

  return(
    <div>
      <div>BUSCAR TOURS</div>
      <div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
        <CollapsibleTrigger asChild >
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <span className="w-10">{destino}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div>
              {destinations.map((destination) => (
                <div key={destination.id} onClick={() => {
                  setDestino(destination.name,{shallow:false})
                  setIsOpen(false)
                  }}>
                  {destination.name}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}



interface TourCategoryListProps {
  categories: TourCategory[];
  title?: string; // Optional title for the collapsible trigger
}

function TourCategoryList({
  categories,
  title = 'Categories', // Default title
}: TourCategoryListProps) {
  const [isOpen, setIsOpen] = React.useState(true); // Default to open
  //const [selectedCategories, setSelectedCategories] = useQueryState('categories', parseAsArrayOf(parseAsString))
  const [selectedCategories, setSelectedCategories] = useQueryState('categories', parseAsArrayOf(parseAsString).withOptions({shallow:false}))

  console.log(selectedCategories)

  return (
    <div className="border border-gray-300 p-4 rounded">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
        <div className="flex items-center justify-between space-x-4">
          <h4 className="text-sm font-semibold">{title}</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories?.includes(category.name)}
                onCheckedChange={(checked) => {
                  // Asegurarse de que checked es booleano
                  const isSelected = checked === true || checked === 'indeterminate';
                  setSelectedCategories(prev => {
                    const currentValues = prev!;
                    if (isSelected) {
                      return [...currentValues, category.name];
                    } else {
                      const filteredValues = currentValues.filter(c => c !== category.name);
                      return filteredValues
                    }
                  },{shallow:false})
                 }}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
} 