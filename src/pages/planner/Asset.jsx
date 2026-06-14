import { useEffect, useState } from "react";
import styles from "../../styles/Admin.module.css";
import { useOutletContext } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBoxesStacked,
  FaEye,
  FaMagnifyingGlass,
  FaPencil,
  FaPlus,
  FaTrash,
  FaWrench,
} from "react-icons/fa6";
import {
  createAsset,
  deleteAsset,
  showAsset,
  updateAsset,
} from "../../_services/asset";
import {
  addObject as assetAddObj,
  editObject as assetEditObj,
  viewObject as assetViewObj,
} from "../../_utilities/actionObject/assetObject";
import {
  addObject as toolAddObj,
  editObject as toolEditObj,
  viewObject as toolViewObj,
} from "../../_utilities/actionObject/toolObject";
import {
  assetSearchOptions,
  toolSearchOptions,
} from "../../_utilities/ToolAsset/searchObject";
import { createTool, showTool, updateTool } from "../../_services/tool";

export default function Asset() {
  const { data, firstLoad, overlay, feature } = useOutletContext();

  const { assets, tools } = data;
  const { setIsLoading, setInfoModal, setConfirmModal, setFormModal } = overlay;
  const {
    totalPage,
    currentPage,
    toolAsset,
    setToolAsset,
    setSearchData,
    handleChangePage,
    handleChangePath,
    handleSearchSubmit,
  } = feature;

  const [items, setItems] = useState([]);
  const [searchObj, setSearchObj] = useState([]);

  const editObject = toolAsset ? toolEditObj : assetEditObj;
  const addObject = toolAsset ? toolAddObj : assetAddObj;
  const viewObject = toolAsset ? toolViewObj : assetViewObj;

  useEffect(() => {
    const { isFirstLoad } = firstLoad;

    if (!isFirstLoad) {
      setIsLoading(true);

      handleChangePage("default");

      setSearchData({
        key: "",
        value: "",
      });
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { setIsFirstLoad } = firstLoad;

    let conditionTimeout;

    if (assets && tools) {
      setItems(toolAsset ? tools : assets);
      setSearchObj(toolAsset ? toolSearchOptions : assetSearchOptions);

      conditionTimeout = setTimeout(() => {
        setIsFirstLoad(false);
        setIsLoading(false);
      }, 250);
    }

    const overlimitTimeout = setTimeout(() => {
      setIsFirstLoad(false);
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(conditionTimeout);
      clearTimeout(overlimitTimeout);
    };

    // eslint-disable-next-line
  }, [assets, tools, toolAsset]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value?.toLowerCase(),
    }));
  };

  const handleDelete = (id) => {
    const onClose = (isError) => {
      setInfoModal((prev) => ({ ...prev, isOpen: false }));

      if (!isError) {
        handleChangePage("default");
      }
    };

    const onSubmit = async () => {
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));

      try {
        setIsLoading(false);

        await deleteAsset(id);

        setInfoModal({
          isOpen: true,
          title: "Successfully",
          message: `Delete asset with id ${id} successfully`,
          onClose: () => onClose(false),
        });
      } catch (error) {
        console.log(error?.message);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Failed",
          message: error?.message,
          onClose: () => onClose(true),
        });
      } finally {
        setIsLoading(false);
      }
    };

    setConfirmModal({
      isOpen: true,
      title: `Delete ${id}`,
      message: "Are you sure to delete?",
      onSubmit,
      onCancel: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const handleAddEdit = async (id, isEdit) => {
    const onClose = (reload, info) => {
      if (!info) {
        setInfoModal((prev) => ({ ...prev, isOpen: false }));
      } else {
        setFormModal((prev) => ({ ...prev, isOpen: false }));
      }

      if (reload) {
        handleChangePage("default");
      }
    };

    const onSubmit = async (e, formData) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const { success, message } = isEdit
          ? toolAsset
            ? await updateTool(id, formData)
            : await updateAsset(id, formData)
          : toolAsset
          ? await createTool(formData)
          : await createAsset(formData);

        setFormModal((prev) => ({ ...prev, isOpen: false }));

        setInfoModal({
          isOpen: true,
          title: `Success: ${success}`,
          message: message,
          onClose: () => onClose(true),
        });
      } catch (error) {
        console.log(error);

        setInfoModal({
          isOpen: true,
          isError: true,
          title: "Failed",
          message: error?.message,
          onClose: () => onClose(false),
        });
      } finally {
        setIsLoading(false);
      }
    };

    try {
      setIsLoading(true);

      const { data } = isEdit
        ? toolAsset
          ? await showTool(id)
          : await showAsset(id)
        : {};

      setIsLoading(false);

      setFormModal({
        isOpen: true,
        fields: isEdit ? editObject : addObject,
        data,
        onSubmit,
        onClose: () => onClose(false, true),
      });
    } catch (error) {
      console.log(error);

      setInfoModal({
        isOpen: true,
        isError: true,
        title: "Failed",
        message: error?.message,
        onClose: () => onClose(false),
      });
    }
  };

  const defaultStyle = {
    borderColor: "var(--primary)",
    color: "var(--primary)",
  };
  const activeStyle = {
    backgroundColor: "var(--primary)",
    borderColor: "var(--primary)",
    color: "var(--white)",
  };

  return (
    <main className={styles.main}>
      <section className={styles.title}>
        <h1>
          <FaWrench className={styles.titleIcon} /> Tools & Assets Data
        </h1>
      </section>

      <section rank="full" className={styles.data}>
        <form onSubmit={handleSearchSubmit}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              name="value"
              id="value"
              placeholder="Search..."
              onChange={handleSearchChange}
            />

            <select name="key" id="key" onChange={handleSearchChange}>
              <option value="">Search by</option>
              {searchObj?.map((s) => (
                <option key={s?.value} value={s?.value}>
                  {s?.label}
                </option>
              ))}
            </select>

            <button type="submit" title="Search">
              <FaMagnifyingGlass />
            </button>

            <button type="button" onClick={() => handleAddEdit()}>
              <FaPlus />
            </button>

            <button
              type="button"
              onClick={() => setToolAsset(true)}
              style={toolAsset ? activeStyle : defaultStyle}
            >
              <FaWrench />
            </button>

            <button
              type="button"
              onClick={() => setToolAsset(false)}
              style={!toolAsset ? activeStyle : defaultStyle}
            >
              <FaBoxesStacked />
            </button>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>{toolAsset ? "Tool" : "Asset"} Number</th>
                <th>{toolAsset ? "Name" : "Description"}</th>
                <th>{toolAsset ? "Specification" : "District"}</th>
                <th>{toolAsset ? "Stock Code" : "Location"}</th>
                {!toolAsset && <th>Class</th>}
                {!toolAsset && <th>Status</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items?.length === 0 ? (
                <tr>
                  <td colSpan={7}>No Tools or Assets</td>
                </tr>
              ) : null}

              {items?.map((item) => (
                <tr key={item?.asset_number || item?.tool_number}>
                  <td>{item?.asset_number || item?.tool_number}</td>
                  <td>{item?.description || item?.name}</td>
                  <td>{item?.district || item?.specification}</td>
                  <td>{item?.location || item?.stock_code}</td>
                  {!toolAsset && <td>{item?.class}</td>}
                  {!toolAsset && (
                    <td>
                      <span status={item?.status}>{item?.status}</span>
                    </td>
                  )}
                  <td>
                    <div className={styles.action}>
                      <button
                        title="View"
                        onClick={() =>
                          handleChangePath({
                            path: toolAsset ? "tools/view" : "assets/view",
                            data: {
                              ...viewObject,
                              id: toolAsset
                                ? item?.tool_number
                                : item?.asset_number,
                            },
                          })
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        title="Edit"
                        onClick={() =>
                          handleAddEdit(
                            toolAsset ? item?.tool_number : item?.asset_number,
                            true
                          )
                        }
                      >
                        <FaPencil />
                      </button>
                      <button
                        title="Delete"
                        onClick={() =>
                          handleDelete(
                            toolAsset ? item?.tool_number : item?.asset_number
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginateContainer}>
          <button
            onClick={() => handleChangePage(false)}
            disabled={currentPage == 1}
          >
            <FaArrowLeft /> Prev
          </button>

          {totalPage <= 1 ? (
            <div className={styles.page}>
              <span title={`Page ${currentPage}`}>{currentPage}</span>
            </div>
          ) : (
            <div className={styles.page}>
              {currentPage !== 1 && (
                <span
                  title={`Page 1`}
                  inactive="true"
                  onClick={() => handleChangePage(1)}
                >
                  1
                </span>
              )}

              <span title={`Page ${currentPage}`}>{currentPage}</span>

              {currentPage !== totalPage && (
                <span
                  title={`Page ${totalPage}`}
                  inactive="true"
                  onClick={() => handleChangePage(Number(totalPage))}
                >
                  {totalPage}
                </span>
              )}
            </div>
          )}

          <button
            onClick={() => handleChangePage(true)}
            disabled={currentPage == totalPage || totalPage == 0}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
}
