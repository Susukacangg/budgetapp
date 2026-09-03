import {useState, useEffect, FormEvent} from 'react'
import {mockCategories} from '../../../app/fixtures/mock-data'
import {List, ListItem, Fab, Modal, IconButton, Spinner} from '../../../shared/ui'
import {ChevronDown, ChevronUp} from '../../../shared/icon'
import {CategoriesForm} from './CategoriesForm.tsx'
import {type CategoryGroup, groupCategories, CATEGORY_TYPES, type CategoryType, insertCategorySchema} from '../model.ts'
import {type CategoryDao, getAllCategories, insertCategory} from "../../categories/repository.ts";
import {convertCategoryFromDao, type Category} from "../model.ts";

export function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [formKey, setFormKey] = useState<number>(0)
    const [openIds, setOpenIds] = useState<Set<number>>(new Set())
    const [groups, setGroups] = useState<CategoryGroup[]>([])
    const [categoriesList, setCategoriesList] = useState<Category[]>([])
    const [isInserting, setIsInserting] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        let areCategoriesLoaded = false;

        async function loadCategories() {
            try {
                setIsLoading(true)
                const categories: CategoryDao[] = await getAllCategories()
                // Ignore the Strict Mode (or navigate-away) request that finished after cleanup
                if (areCategoriesLoaded) return
                console.log('fetched categories: ', categories)
                const converted: Category[] = categories.map(convertCategoryFromDao)
                setCategoriesList(converted)
                setGroups(groupCategories(converted))
            } catch (err) {
                if (!areCategoriesLoaded) console.error('get failed:', err)
            } finally {
                if (!areCategoriesLoaded) setIsLoading(false)
            }
        }

        void loadCategories()

        return () => {
            areCategoriesLoaded = true;
        }
    }, [])

    async function addNewCategory(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const fd = new FormData(form)

        const parsed = insertCategorySchema.safeParse({
            category_name: fd.get('category_name'),
            category_type: fd.get('category_type'),
            category_parent: fd.get('category_parent'),
            category_desc: fd.get('category_desc'),
        })

        if (!parsed.success) {
            console.error('Validation failed:', parsed.error.flatten().fieldErrors)
            return
        }

        try {
            setIsInserting(true)
            const saved = await insertCategory(parsed.data)
            console.log("Inserted: ", saved)
            const converted = convertCategoryFromDao(saved)
            setCategoriesList((prev) => [...prev, converted])
            setGroups(groupCategories([...categoriesList, converted]))
            setIsModalOpen(false)
        } catch (err) {
            console.log("Insert failed: ", err)
        } finally {
            setIsInserting(false)
        }
    }

    function openListItem(id: number) {
        setOpenIds(prevState => {
            const newState = new Set(prevState)
            if (newState.has(id)) newState.delete(id)
            else newState.add(id)
            return newState
        })
    }

    function renderListByCategoryType(categoryType: CategoryType) {
        return groups
            .filter((group) => group.parent.type == categoryType)
            .map(({parent, children}, index) => (
                <ListItem
                    key={parent.id}
                    index={index}
                    clickable={false}
                >
                    <div className={"sub-list"}>
                        <p
                            style={{
                                marginBottom: (openIds.has(parent.id)) ? '1.5rem' : ''
                            }}
                        >
                            <b>{parent.name}</b>
                        </p>
                        <ul>
                            {openIds.has(parent.id) && children.map((subCat, index) => (
                                <li key={subCat.id}>
                                    {subCat.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="trailing">
                        <span className="muted">{`${parent.type}`}</span>
                        <IconButton
                            onClick={() => openListItem(parent.id)}
                        >
                            <ChevronDown
                                style={{
                                    transform: openIds.has(parent.id) ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                            />
                        </IconButton>
                    </div>
                </ListItem>
            ))
    }

    return (
      <section className="page">
          <h2>Categories</h2>

          {isLoading && <Spinner style={{
              alignSelf: 'center',
              marginTop: '50px'
          }}/>}

          {!isLoading && <p className="muted">Expenses</p>}
          {!isLoading &&
              <List>
                  {renderListByCategoryType(CATEGORY_TYPES.EXPENSE.valueOf())}
              </List>
          }

          {!isLoading && <p className="muted">Income</p>}
          {!isLoading &&
              <List>
                  {renderListByCategoryType(CATEGORY_TYPES.INCOME.valueOf())}
              </List>
          }


          <Modal title={"Add Category"}
                 isOpen={isModalOpen}
                 onClose={() => {
                     setIsModalOpen(false)
                     setFormKey((prev) => prev + 1)
                 }}
          >
              <CategoriesForm
                  key={formKey}
                  isLoading={isInserting}
                  availableCategories={categoriesList}
                  onSubmitHandler={addNewCategory}
              />
          </Modal>
          <Fab onClick={() => setIsModalOpen(true)}/>
      </section>
    )
}
