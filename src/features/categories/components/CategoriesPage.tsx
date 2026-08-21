import {useState} from 'react'
import {mockCategories} from '../../../app/fixtures/mock-data'
import {List, Fab, Modal} from '../../../shared/ui'
import {CategoriesForm} from './CategoriesForm.tsx'

export function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [formKey, setFormKey] = useState<number>(0)

    return (
      <section className="page">
          <h2>Categories</h2>
          <p className="muted">Taxonomy for spend and income.</p>
          <List clickable={false} items={mockCategories}/>

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
