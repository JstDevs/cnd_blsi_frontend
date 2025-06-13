import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "@/components/common/FormField";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Trash2, Pencil } from "lucide-react";

// Sample mock data
const mockRevisions = [
  {
    id: 1,
    revisionYear: "2024 H",
    revisionCode: "24",
    taxDeclarationCode: "TDC-001",
    municipalityAssessor: "Caballero, Joven",
    assistantMunicipalityAssessor: "Elopre, Clark",
    provincialAssessor: "Aruscaldo, Vincent",
    assistantProvincialAssessor: "Orquin, Melvin"
  },
  {
    id: 2,
    revisionYear: "2023 G",
    revisionCode: "23",
    taxDeclarationCode: "TDC-002",
    municipalityAssessor: "Santos, Miguel",
    assistantMunicipalityAssessor: "Lopez, Ana",
    provincialAssessor: "Reyes, John",
    assistantProvincialAssessor: "Cruz, Carla"
  },
  {
    id: 3,
    revisionYear: "2022 F",
    revisionCode: "22",
    taxDeclarationCode: "TDC-003",
    municipalityAssessor: "Garcia, Tomas",
    assistantMunicipalityAssessor: "Rivera, Julia",
    provincialAssessor: "Domingo, Leo",
    assistantProvincialAssessor: "Perez, Nina"
  }
];

const revisionSchema = Yup.object().shape({
  revisionYear: Yup.string().required("Revision Year is required"),
  revisionCode: Yup.string().required("Revision Code is required"),
  taxDeclarationCode: Yup.string().required("Tax Declaration Code is required")
});

const GeneralRevision = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [revisions, setRevisions] = useState(mockRevisions);

  const handleAdd = () => {
    setSelectedRevision(null);
    setIsModalOpen(true);
  };

  const handleEdit = (revision) => {
    setSelectedRevision(revision);
    setIsModalOpen(true);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    if (selectedRevision) {
      // Update existing
      setRevisions((prev) =>
        prev.map((r) => (r.id === selectedRevision.id ? { ...r, ...values } : r))
      );
    } else {
      // Create new
      setRevisions((prev) => [
        ...prev,
        { id: Date.now(), ...values }
      ]);
    }
    setIsModalOpen(false);
    setSubmitting(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">General Revision</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add Revision
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Revision Year</th>
              <th className="px-4 py-2 border">Tax Declaration Code</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {revisions.map((rev) => (
              <tr key={rev.id}>
                <td className="px-4 py-2 border">{rev.revisionYear}</td>
                <td className="px-4 py-2 border">{rev.taxDeclarationCode}</td>
                <td className="px-4 py-2 border space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(rev)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setRevisions((prev) => prev.filter((r) => r.id !== rev.id))
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal with Formik */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRevision ? "Edit General Revision" : "New General Revision"}
        size="lg"
      >
        <Formik
          initialValues={{
            revisionYear: selectedRevision?.revisionYear || "",
            revisionCode: selectedRevision?.revisionCode || "",
            taxDeclarationCode: selectedRevision?.taxDeclarationCode || "",
            municipalityAssessor: selectedRevision?.municipalityAssessor || "",
            assistantMunicipalityAssessor: selectedRevision?.assistantMunicipalityAssessor || "",
            provincialAssessor: selectedRevision?.provincialAssessor || "",
            assistantProvincialAssessor: selectedRevision?.assistantProvincialAssessor || ""
          }}
          validationSchema={revisionSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="General Revision Date (Year)"
                  name="revisionYear"
                  type="text"
                  value={values.revisionYear}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.revisionYear}
                  touched={touched.revisionYear}
                  required
                />
                <FormField
                  label="General Revision Code"
                  name="revisionCode"
                  type="text"
                  value={values.revisionCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.revisionCode}
                  touched={touched.revisionCode}
                  required
                />
              </div>

              <FormField
                label="General Revision Tax Declaration Code"
                name="taxDeclarationCode"
                type="text"
                value={values.taxDeclarationCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.taxDeclarationCode}
                touched={touched.taxDeclarationCode}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="City Or Municipality Assessor"
                  name="municipalityAssessor"
                  type="select"
                  options={[
                    {
                      value: "Caballero, Joven",
                      label: "Curimao, Caballero, Joven",
                    },
                  ]}
                />
                <FormField
                  label="Assistant City Or Municipality Assessor"
                  name="assistantMunicipalityAssessor"
                  type="select"
                  options={[
                    { value: "Elopre, Clark", label: "Entac, Elopre, Clark" },
                  ]}
                />
                <FormField
                  label="Provincial Assessor"
                  name="provincialAssessor"
                  type="select"
                  options={[
                    {
                      value: "Aruscaldo, Vincent",
                      label: "Azupardo, Aruscaldo, Vincent",
                    },
                  ]}
                />
                <FormField
                  label="Assistant Provincial Assessor"
                  name="assistantProvincialAssessor"
                  type="select"
                  options={[
                    {
                      value: "Orquin, Melvin",
                      label: "Alvarez, Orquin, Melvin",
                    },
                  ]}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {selectedRevision ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default GeneralRevision;
