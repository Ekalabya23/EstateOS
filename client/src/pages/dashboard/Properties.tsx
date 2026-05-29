import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Building2,
  ArrowUpDown,
} from "lucide-react";
import StatusBadge from "../../components/dashboard/StatusBadge";
import api from "../../lib/axios";

interface Property {
  _id: string;
  title: string;
  city: string;
  state: string;
  propertyType: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

const propertyTypes = [
  "All",
  "apartment",
  "villa",
  "penthouse",
  "commercial",
  "land",
];
const statuses = ["All", "available", "sold", "rented", "under-review"];

export default function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState("-createdAt");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortField,
      };
      if (filterType !== "All") params.propertyType = filterType;
      if (filterStatus !== "All") params.status = filterStatus;

      const { data } = await api.get("/properties", { params });
      setProperties(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [pagination.page, filterType, filterStatus, sortField]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
    setActiveMenu(null);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const filteredProperties = search
    ? properties.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.city.toLowerCase().includes(search.toLowerCase()),
      )
    : properties;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-2xl text-[var(--color-charcoal)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Properties
          </h1>
          <p className="text-[12px] text-[var(--color-stone)] mt-0.5">
            {pagination.total} total properties in your portfolio
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/properties/new")}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.04 }}
        className="flex flex-col lg:flex-row gap-3 items-start lg:items-center"
      >
        {/* Search */}
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-stone-light)]" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[var(--color-mist)] text-[13px] text-[var(--color-charcoal)] placeholder:text-[var(--color-stone-light)] focus:outline-none focus:border-[var(--color-champagne)]/50 transition-colors"
          />
        </div>

        {/* Type Pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                filterType === type
                  ? "bg-[var(--color-charcoal)] text-white"
                  : "bg-white text-[var(--color-stone)] border border-[var(--color-mist)] hover:border-[var(--color-stone-light)]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => {
                setFilterStatus(st);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                filterStatus === st
                  ? "bg-[var(--color-charcoal)] text-white"
                  : "bg-white text-[var(--color-stone)] border border-[var(--color-mist)] hover:border-[var(--color-stone-light)]"
              }`}
            >
              {st === "All" ? "All Status" : st.replace("-", " ")}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="content-panel overflow-hidden"
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3.5 animate-pulse">
                <div className="w-11 h-11 rounded-lg bg-[var(--color-cream)]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-[var(--color-cream)] rounded w-40" />
                  <div className="h-2.5 bg-[var(--color-cream)] rounded w-28" />
                </div>
                <div className="h-5 w-16 bg-[var(--color-cream)] rounded-md" />
                <div className="h-3.5 w-14 bg-[var(--color-cream)] rounded" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-cream)] flex items-center justify-center mb-3">
              <Building2 className="w-7 h-7 text-[var(--color-stone-light)]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[var(--color-charcoal)] mb-1.5">
              No properties found
            </h3>
            <p className="text-[13px] text-[var(--color-stone)] mb-5">
              Get started by adding your first property.
            </p>
            <button
              onClick={() => navigate("/dashboard/properties/new")}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-charcoal)] text-white text-[13px] font-medium rounded-lg hover:bg-[var(--color-champagne-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_100px_90px_90px_70px_40px] gap-3 px-5 py-2.5 border-b border-[var(--color-mist)] bg-[var(--color-warm-white)]/70">
              <button
                onClick={() =>
                  setSortField((f) => (f === "title" ? "-title" : "title"))
                }
                className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] text-left"
              >
                Property <ArrowUpDown className="w-2.5 h-2.5" />
              </button>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)]">
                Type
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)]">
                Status
              </span>
              <button
                onClick={() =>
                  setSortField((f) => (f === "-price" ? "price" : "-price"))
                }
                className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)] text-left"
              >
                Price <ArrowUpDown className="w-2.5 h-2.5" />
              </button>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-stone)]">
                Area
              </span>
              <span />
            </div>

            {/* Rows */}
            {filteredProperties.map((prop, i) => (
              <motion.div
                key={prop._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                className="grid grid-cols-[1fr_100px_90px_90px_70px_40px] gap-3 px-5 py-3 border-b border-[var(--color-mist)]/60 last:border-0 hover:bg-[var(--color-warm-white)]/40 transition-colors items-center group"
              >
                {/* Property */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-lg bg-cover bg-center shrink-0 border border-[var(--color-mist)]"
                    style={{
                      backgroundImage: prop.images?.[0]
                        ? `url(${prop.images[0]})`
                        : "linear-gradient(135deg, var(--color-cream), var(--color-mist))",
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-charcoal)] truncate leading-tight">
                      {prop.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-stone)] mt-0.5">
                      {prop.city}, {prop.state}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] capitalize text-[var(--color-stone)] font-medium">
                  {prop.propertyType}
                </span>

                <StatusBadge status={prop.status} />

                <span
                  className="text-[13px] font-medium text-[var(--color-charcoal)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {formatPrice(prop.price)}
                </span>

                <span className="text-[11px] text-[var(--color-stone)]">
                  {prop.area}
                </span>

                {/* Actions */}
                <div className="relative flex justify-end">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === prop._id ? null : prop._id)
                    }
                    className="p-1 rounded-md hover:bg-[var(--color-cream)] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4 text-[var(--color-stone)]" />
                  </button>

                  <AnimatePresence>
                    {activeMenu === prop._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-[var(--shadow-editorial)] border border-[var(--color-mist)] overflow-hidden py-0.5 z-20"
                      >
                        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]">
                          <Eye className="w-3.5 h-3.5 text-[var(--color-stone)]" />{" "}
                          View
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[var(--color-charcoal)] hover:bg-[var(--color-warm-white)]">
                          <Pencil className="w-3.5 h-3.5 text-[var(--color-stone)]" />{" "}
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prop._id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-mist)]">
              <p className="text-[11px] text-[var(--color-stone)]">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} properties
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.max(1, p.page - 1),
                    }))
                  }
                  disabled={pagination.page <= 1}
                  className="p-1.5 rounded-md border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-[var(--color-stone)]" />
                </button>
                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.min(p.totalPages, p.page + 1),
                    }))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-1.5 rounded-md border border-[var(--color-mist)] hover:bg-[var(--color-warm-white)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-stone)]" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
