import {useState, useEffect, Fragment, type SyntheticEvent} from 'react'
import {List, ListItem, Fab, Modal, Spinner} from '../../../shared/ui'
import {CategoriesForm} from './CategoriesForm.tsx'
import {
    type CategoryGroup,
    groupCategories,
    CATEGORY_TYPES,
    insertCategorySchema,
    convertCategoryFromDao,
    type Category
} from '../model.ts'
import {type CategoryDao, getAllCategories, insertCategory} from "../repository.ts";
import {CategoryDetailDisplay} from "./CategoryDetailDisplay.tsx";
import {Add} from "../../../shared/icon";

export function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [formKey, setFormKey] = useState<number>(0)
    const [openId, setOpenId] = useState<number>()
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
    const [categoriesList, setCategoriesList] = useState<Category[]>([])
    const [isInserting, setIsInserting] = useState<boolean>(false)
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
    const [isInsertFormDisplay, setIsInsertFormDisplay] = useState<boolean>(false)
    const [isDetailDisplay, setIsDetailDisplay] = useState<boolean>(false)
    const [modalTitle, setModalTitle] = useState<string>("")

    useEffect(() => {
        let areCategoriesLoaded = false;

        async function loadCategories() {
            try {
                setIsLoadingCategories(true)
                const categories: CategoryDao[] = await getAllCategories()
                // Ignore the Strict Mode (or navigate-away) request that finished after cleanup
                if (areCategoriesLoaded) return
                console.log('fetched categories: ', categories)
                const converted: Category[] = categories.map(convertCategoryFromDao)
                setCategoriesList(converted)
                setCategoryGroups(groupCategories(converted))
            } catch (err) {
                if (!areCategoriesLoaded) console.error('get failed:', err)
            } finally {
                if (!areCategoriesLoaded) setIsLoadingCategories(false)
            }
        }

        void loadCategories()

        return () => {
            areCategoriesLoaded = true;
        }
    }, [])

    async function addNewCategory(event: SyntheticEvent<HTMLFormElement>) {
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
            console.error('Validation failed:', parsed.error)
            return
        }

        try {
            setIsInserting(true)
            const saved = await insertCategory(parsed.data as CategoryDao)
            console.log("Inserted: ", saved)
            const converted = convertCategoryFromDao(saved)
            setCategoriesList((prev) => [...prev, converted])
            setCategoryGroups(groupCategories([...categoriesList, converted]))
            closeModal()
        } catch (err) {
            console.log("Insert failed: ", err)
        } finally {
            setIsInserting(false)
        }
    }

    function renderListByCategoryType() {
        return Object.values(CATEGORY_TYPES)
            .map((categoryType) => (
                <List key={categoryType}>
                    <p className={"muted"}>{categoryType}</p>
                    {categoryGroups
                        .filter((group) => group.parent.type == categoryType)
                        .map((categoryGroup, index) => (
                            renderCategoryListItem(categoryGroup, index)
                        ))
                    }
                </List>
            ))
    }

    function renderCategoryListItem({parent, children}: CategoryGroup, index: number) {
        return (
            <Fragment key={parent.id}>
                <ListItem
                    index={index}
                    onClick={() => openListItem(parent.id)}
                >
                    <div>
                        <b>{`${parent.name}${children.length > 0 ? ` (${children.length})` : ""}`}</b>
                        <p style={{
                            color: "var(--text-muted)",
                            fontStyle: "italic",
                            fontSize: "12px",
                        }}>
                            {children.map((category, index) => (
                                `${category.name}${index === children.length - 1 ? "" : ", "}`
                            ))}
                        </p>
                    </div>
                </ListItem>
            </Fragment>
        )
    }

    function openListItem(id: number) {
        setOpenId(id)
        setIsDetailDisplay(true)
        setModalTitle(() => {
            // @ts-expect-error the result of find Array.find will never be empty
            // as the openListItem function is only called when there's a list item being clicked on
            const newTitle: string = categoriesList.find((category) => category.id == id).name
            return newTitle === undefined ? "" : newTitle
        })
        setIsModalOpen(true)
    }

    function openInsertForm() {
        setIsInsertFormDisplay(true)
        setModalTitle("Add New Category")
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
        setFormKey((prev) => prev + 1)
        setOpenId(undefined)
        setIsDetailDisplay(false)
        setIsInsertFormDisplay(false)
    }

    function getCategoryGroup(id: number) {
        return categoryGroups.find((categoryGroup) => categoryGroup.parent.id == id)
    }

    return (
      <section className="page">
          <h2>Categories</h2>

          {isLoadingCategories && <Spinner style={{
              alignSelf: 'center',
              marginTop: '50px'
          }}/>}

          {!isLoadingCategories && renderListByCategoryType()}

          <Modal title={modalTitle}
                 isOpen={isModalOpen}
                 onClose={closeModal}
                 position="right"
                 style={{
                     zIndex: 69
                 }}
          >
              {isInsertFormDisplay &&
                  <CategoriesForm
                      key={formKey}
                      isLoading={isInserting}
                      availableCategories={categoriesList}
                      onSubmitHandler={addNewCategory}
                  />
              }
              {isDetailDisplay &&
                  <CategoryDetailDisplay
                      // @ts-expect-error category won't be empty
                      // because this element will only be rendered if there even
                      // is a list item to click on
                      categoryGroup={getCategoryGroup(openId)}
                  />
              }
          </Modal>
          <Fab onClick={openInsertForm}>
              <Add width={2.75}/>
          </Fab>
      </section>
    )
}
