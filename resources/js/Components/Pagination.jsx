import React from "react";

const Pagination = ({ links, onPageChange }) => {
    const pageLinks = links.slice(1, -1);
    const totalPages = pageLinks.length;

    const activeIndex = pageLinks.findIndex((link) => link.active);

    const currentGroup = Math.floor(activeIndex / 10);
    const startIndex = currentGroup * 10;
    const endIndex = Math.min(startIndex + 10, totalPages);

    const hasPreviousGroup = startIndex > 0;
    const hasNextGroup = endIndex < totalPages;

    return (
        <div className="flex justify-center my-10">
            <div className="join">
                {totalPages > 1 && (
                    <button
                        className="join-item btn"
                        onClick={() => onPageChange(pageLinks[0].url)}
                        disabled={activeIndex === 0}
                    >
                        &laquo;
                    </button>
                )}

                {hasPreviousGroup && (
                    <button
                        className="join-item btn"
                        onClick={() =>
                            onPageChange(pageLinks[startIndex - 1].url)
                        }
                    >
                        ...
                    </button>
                )}

                {pageLinks.slice(startIndex, endIndex).map((link, index) => (
                    <button
                        key={startIndex + index}
                        className={`join-item btn ${
                            link.active ? "btn-active" : ""
                        }`}
                        onClick={() => link.url && onPageChange(link.url)}
                        disabled={link.url === null}
                        checked={link.active ? "checked" : undefined}
                    >
                        {startIndex + index + 1}
                    </button>
                ))}

                {hasNextGroup && (
                    <button
                        className="join-item btn"
                        onClick={() => onPageChange(pageLinks[endIndex].url)}
                    >
                        ...
                    </button>
                )}

                {totalPages > 1 && (
                    <button
                        className="join-item btn"
                        onClick={() =>
                            onPageChange(pageLinks[totalPages - 1].url)
                        }
                        disabled={activeIndex === totalPages - 1}
                    >
                        &raquo;
                    </button>
                )}
            </div>
        </div>
    );
};

export default Pagination;
