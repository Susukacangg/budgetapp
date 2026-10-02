import {useState, useEffect, Fragment, type SyntheticEvent} from 'react'
import {List, ListItem, Fab, PageModal, Spinner, usePageModal} from '../../../shared/ui'
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
import {toCategoryDetailView} from '../detailDisplay.ts'
import {Add} from "../../../shared/icon";
import {PageModalDetailDisplayForm, PageModalInsertForm} from "../../../shared/ui/PageModal.tsx";

export function CategoriesPage() {
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
    const [categoriesList, setCategoriesList] = useState<Category[]>([])
    const [isInserting, setIsInserting] = useState<boolean>(false)
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
    const pageModal = usePageModal()

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
            pageModal.replaceWithDetail(saved.id)
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
                    onClick={() => pageModal.openDetail(parent.id)}
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

    function getCategoryGroup(id: number) {
        const parent = categoriesList.find((cat) => cat.id === id)
        if (!parent) return null
        return {
            parent: parent,
            children: categoriesList.filter((cat) => cat.parentId === id)
        }
    }

    return (
      <section className="page">
          <h2>Categories</h2>

          {isLoadingCategories && <Spinner style={{
              alignSelf: 'center',
              marginTop: '50px'
          }}/>}

          {!isLoadingCategories && renderListByCategoryType()}

          <PageModal
              modal={pageModal}
              insertTitle="Add New Category"
              style={{
                  zIndex: 69
              }}
          >
              <PageModalInsertForm>
                  <CategoriesForm
                      isLoading={isInserting}
                      availableCategories={categoriesList}
                      onSubmitHandler={addNewCategory}
                  />
              </PageModalInsertForm>

              <PageModalDetailDisplayForm
                  resolveDetail={(id) => getCategoryGroup(id)}
                  resolveTitle={(group) => group == null ? "" : group.parent.name}
                  resolveDetailDisplay={(group) =>
                  // @ts-ignore
                      toCategoryDetailView(group, pageModal.openDetail)}
              />
          </PageModal>
          <Fab onClick={pageModal.openInsertForm}>
              <Add width={2.75}/>
          </Fab>
      </section>
    )
}
