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
import {MODAL_VIEW_TYPE, useModalStack} from "../../../shared/ui/";

export function CategoriesPage() {
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([])
    const [categoriesList, setCategoriesList] = useState<Category[]>([])
    const [isInserting, setIsInserting] = useState<boolean>(false)
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
    const modal = useModalStack()
    const modalView = modal.current

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
            modal.reset({kind: MODAL_VIEW_TYPE.DETAIL_DISPLAY, id: saved.id})
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

    function renderModalView() {
        switch (modalView?.kind) {
            case MODAL_VIEW_TYPE.INSERT_FORM:
                return (
                    <CategoriesForm
                        isLoading={isInserting}
                        availableCategories={categoriesList}
                        onSubmitHandler={addNewCategory}
                    />
                )
            case MODAL_VIEW_TYPE.DETAIL_DISPLAY:
                return (
                    <CategoryDetailDisplay
                        // @ts-expect-error category group won't be empty
                        // because this element will only be rendered if there even
                        // is a list item to click on
                        categoryGroup={getCategoryGroup(modalView.id)}
                        onSubCatSelect={openListItem}
                    />
                )
            default: return (<></>)
        }
    }

    function openInsertForm() {
        modal.push({kind: MODAL_VIEW_TYPE.INSERT_FORM})
    }

    function openListItem(id: number) {
        modal.push({kind: MODAL_VIEW_TYPE.DETAIL_DISPLAY, id})
    }

    function getCategoryGroup(id: number) {
        const parent = categoriesList.find((cat) => cat.id === id)
        if (!parent) return null
        return {
            parent: parent,
            children: categoriesList.filter((cat) => cat.parentId === id)
        }
    }

    function getModalTitle(): string {
        switch (modalView?.kind) {
            case MODAL_VIEW_TYPE.INSERT_FORM:
                return "Add New Category"
            case MODAL_VIEW_TYPE.DETAIL_DISPLAY: {
                const newTitle = categoriesList.find(
                    (category) => category.id == modalView.id)?.name
                return newTitle === undefined ? "" : newTitle
            }
            default:
                return ""
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

          <Modal title={getModalTitle()}
                 isOpen={modal.isOpen}
                 onClose={modal.close}
                 position="right"
                 style={{
                     zIndex: 69
                 }}
          >
              {renderModalView()}
          </Modal>
          <Fab onClick={openInsertForm}>
              <Add width={2.75}/>
          </Fab>
      </section>
    )
}
