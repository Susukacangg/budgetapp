import {useState, useEffect, Fragment, type SyntheticEvent} from 'react'
import {List, ListItem, Fab, PageModal, Spinner, usePageModal} from '../../../shared/ui'
import {CategoriesForm} from './CategoriesForm.tsx'
import {
    type CategoryGroup,
    CATEGORY_TYPES,
    CategoryInsertSchema,
    type Category,
} from '../model.ts'
import {toCategoryDetailView} from '../detailDisplay.ts'
import {Add} from "../../../shared/icon";
import {PageModalDetailDisplayForm, PageModalInsertForm} from "../../../shared/ui/PageModal.tsx";
import type {CategoryFacade} from "../facade/CategoryFacade.ts";
import {CategoryFacadeImpl} from "../impl/facade/CategoryFacadeImpl.ts";

const facade: CategoryFacade = new CategoryFacadeImpl()

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
                const [categories, groupedCategories] = await facade.readAllCategories();
                // Ignore the Strict Mode (or navigate-away) request that finished after cleanup
                if (areCategoriesLoaded) return
                console.log('fetched categories: ', categories)
                setCategoriesList(categories)
                console.log(groupedCategories)
                setCategoryGroups(groupedCategories)
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

        const parsed = CategoryInsertSchema.safeParse({
            name: fd.get('category_name'),
            type: fd.get('category_type'),
            parentId: fd.get('category_parent'),
            categoryDesc: fd.get('category_desc'),
        })

        if (!parsed.success) {
            console.error('Validation failed:', parsed.error)
            return
        }

        try {
            setIsInserting(true)
            const saved = await facade.createNewCategory(parsed.data as Category)
            console.log("Inserted: ", saved)
            setCategoriesList((prev) => [...prev, saved])
            setCategoryGroups((prevGrouped) => {
                if (saved.parentId === null) {
                    return [...prevGrouped, {
                        parent: saved,
                        children: []
                    }]
                } else {
                    const existingGroupIndex: number =
                        categoryGroups.findIndex((group) => group.parent.id === saved.parentId)
                    const updatedGroup: CategoryGroup[] = prevGrouped
                    if (existingGroupIndex > -1)
                        updatedGroup[existingGroupIndex].children.push(saved)
                    return updatedGroup
                }

            })
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
                        <b>{`${parent.name}${children?.length > 0 ? ` (${children.length})` : ""}`}</b>
                        <p style={{
                            color: "var(--text-muted)",
                            fontStyle: "italic",
                            fontSize: "12px",
                        }}>
                            {children?.map((category, index) => (
                                `${category.name}${index === children.length - 1 ? "" : ", "}`
                            ))}
                        </p>
                    </div>
                </ListItem>
            </Fragment>
        )
    }

    function resolveCategoryGroup(id: number): CategoryGroup {
        const topLevelGroup = categoryGroups.find((group) => group.parent.id === id)
        if (topLevelGroup != null) return topLevelGroup

        // Subcategories are not group parents, so present them as a group with no children.
        const subcategory = categoryGroups
            .flatMap((group) => group.children)
            .find((child) => child.id === id)
        return subcategory as unknown as CategoryGroup
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
                  resolveDetail={(id) => resolveCategoryGroup(id)}
                  resolveTitle={(group) => group == null ? "" : group.parent.name}
                  resolveDetailDisplay={(group) =>
                      toCategoryDetailView(group, pageModal.openDetail)}
              />
          </PageModal>
          <Fab onClick={pageModal.openInsertForm}>
              <Add width={2.75}/>
          </Fab>
      </section>
    )
}
