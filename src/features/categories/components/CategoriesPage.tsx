import {useState} from 'react'
import {mockCategories} from '../../../app/fixtures/mock-data'
import {List, ListItem, Fab, Modal} from '../../../shared/ui'
import {CategoriesForm} from './CategoriesForm.tsx'

export function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [formKey, setFormKey] = useState<number>(0)

    return (
      <section className="page">
          <h2>Categories</h2>
          <p className="muted">Taxonomy for spend and income.</p>
          <List>
              {mockCategories.map((category, index) => (
                  <ListItem
                      key={category.id}
                      index={index}
                      clickable={false}
                  >
                      <strong>{category.name}</strong>
                      <span className="muted">
                          {`${category.type}`}
                      </span>
                  </ListItem>
              ))}
          </List>

          <Modal title={"Add Category"}
                 isOpen={isModalOpen}
                 onClose={() => {
                     setIsModalOpen(false)
                     setFormKey((prev) => prev + 1)
                 }}
          >
              <CategoriesForm/>
          </Modal>
          <Fab onClick={() => setIsModalOpen(true)}/>
      </section>
    )
}
